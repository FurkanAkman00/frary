const express = require('express');
const router = express.Router();
const path = require('path')
const uploadPath = path.join('public','uploads/bookCovers')
const Book = require('../models/books') 
const Author = require('../models/authors'); //This is important i imported authors you have to
const { error } = require('console');  // I didnt write this, its useless
const fs = require('fs')
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
    
    const fileName = req.file != null ? req.file.filename : ''
    
    const book = new Book({
        author: req.body.author,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        coverImage: fileName,
        title: req.body.title
    })

    saveCover(book,req.body.cover)
    
    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch{
        if(book.coverImage != null){
        removeBookCover(book.coverImage) 
        }
        renderNewPage(res,book,true)
    }

})

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypse.includes(cover.mimetype)){
        book.coverImage = new Buffer.from(cover.data,'base64')  // cover.data is actually name of the file yo uwant to upload
        book.coverImageType = cover.type
    }
}


function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName),err =>{
        if(err) console.error(err)
    })
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

