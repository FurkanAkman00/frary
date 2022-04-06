const express = require('express');
const router = express.Router();
const Book = require('../models/books') 
const Author = require('../models/authors'); //This is important i imported authors you have to
const { error } = require('console');  // I didnt write this, its useless
const imageMimeTypse = ['image/jpeg','image/png','image/gif']

// All books route
router.get('/',async (req,res) =>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            searchOptions:req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book route(displaying)
router.get('/new',async (req,res) =>{   
    renderNewPage(res,new Book(),false)    // we are not gonna get error here thats why we dont pass the error
})


// For posting
router.post('/', async (req,res) =>{
    
    const book = new Book({
        author: req.body.author,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        title: req.body.title
    })

    saveCover(book,req.body.cover)
    
    try {
        const newBook = await book.save()
        console.log(book.title)
        res.redirect('/books')
    } catch{
        renderNewPage(res,book,true)
    }

})
/
router.get('/:id',async (req,res) =>{
    try{
        const book = await Book.findById(req.params.id) // In book schema we stored author as. So we need to find author with id inside book schema author variable
            .populate('author').exec() // Populate is actually giving us the author object so we can access the name of the author and etc
        res.render('books/show',{book:book})
    }
    catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res) =>{
    let book
    try{
        book = await Book.findById(req.params.id)
        renderEditPage(res,book)
    }
    catch{
        res.redirect('/')
    }
})

router.put('/:id',async (req,res) =>{
    let book
    try{
        book =  await Book.findById(req.params.id)
        book.title = req.body.title
        book.publishDate = new Date(req.body.publishDate)
        book.description = req.body.description
        book.pageCount = req.body.pageCount
        book.author = req.body.author
        
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book,req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }
    catch{
        if(book != null){
            renderEditPage(res,book,true)
        } else {
        res.redirect('/')
        }
    }
})

router.delete('/:id',async (req,res) =>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.deleteOne()
        res.redirect('/books')
    }
    catch{
        if(book != null){
            res.render('books/show',{book:book,errorMessage:'Cannot find the books'})
        }
        else{
            res.redirect('/')
        }
    }
})

function saveCover(book, coverEncoded){
    if(coverEncoded == null) {return ''}                    // Searching image as string and Saving as buffer
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypse.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64')  // cover.data is actually name of the file you want to upload
        console.log(cover.type)
        book.coverImageType = cover.type
    }
}

async function renderEditPage(res,book,hasError = false){
    try {
        const authors = await Author.find({}) // We are actually waiting this function before rendering our page this is why its async and why we are waiting it
        
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = "Error Editing Book YO!"
        res.render('books/edit', params)
    } catch {
        res.redirect('/books')
    }

}

async function renderNewPage(res,book,hasError = false){
    try {
        const authors = await Author.find({}) // We are actually waiting this function before rendering our page this is why its async and why we are waiting it
        
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = "Error Creating Book YO!"
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

module.exports = router

