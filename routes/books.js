const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public','uploads/bookCovers')
const Book = require('../models/books') 
const Author = require('../models/authors'); //This is important i imported authors you have to
const { error } = require('console');  // I didnt write this, its useless
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const fs = require('fs')

const upload = multer({
    dest: uploadPath,
    fileFilter:  (req,file,cb) =>{
        cb(null,imageMimeTypes.includes(file.mimetype)) // This is the way actually you just use it
    }
})

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
router.post('/', upload.single('cover'), async (req,res) =>{
    
    const fileName = req.file != null ? req.file.filename : ''
    
    const book = new Book({
        author: req.body.author,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        coverImage: fileName,
        title: req.body.title
    })
    
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

