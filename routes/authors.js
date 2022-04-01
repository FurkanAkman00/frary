const express = require('express');
const router = express.Router();
const Author = require('../models/authors'); //This is important i imported authors you have to
const books = require('../models/books');
const Book = require('../models/books')

// All author route
router.get('/',async (req,res) =>{
    
    let searchOptions = {}

    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = req.query.name               // from query i get the url thing
    }

    try {
        
        const authors = await Author.find(searchOptions)   
        res.render('authors/index',{
            authors:authors})

    } catch (error) {
        res.redirect('/')
    }
})

// New author route(displaying)
router.get('/new',(req,res) =>{    // It allows us to create empty object when you render /new
    res.render('authors/new',{author: new Author()})
})

// For posting
router.post('/', async (req,res) =>{

    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()  // Saving author to the database

        res.redirect(`authors/${author.id}`)

    } catch (error) {
        res.render('authors/new',{
             author: author,
             errorMessage: 'Error creating author'
            })
    }
})

router.get('/:id', async (req,res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author:author.id}).limit(6).exec()
        res.render('authors/show',{
            author: author,
            booksByAuthor:books
        })
    } catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res)=>{
    try {
        const author = await Author.findById(req.params.id) //  how that works is it actually goes to authors/edit with spesific id
        res.render('authors/edit',{author: author})
    } catch { 
        res.redirect('/')
    }
}) 

router.put('/:id',async (req,res) =>{
    let author
    
    try {
        
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()  

        res.redirect(`/authors/${author.id}`)

    } catch (error) {
        if(author == null){
            res.redirect('/')
        }
        else{
            res.render('authors/edit',{
                author: author,
                errorMessage: 'Error updating author'
                })}
    }
}) // What resource to  update
                                                  // You need to install a library to use put and delete thing which is called method-override
router.delete('/:id', async (req,res) =>{
    let author

    try {
        
        author = await Author.findById(req.params.id)
        const book = await Book.find({author:author.id})

        if(book != null && book.length > 0){
            res.redirect(`/authors/${author.id}`,{
                errorMessage: 'This author still has books!'
            })}
        else{
            await author.deleteOne()
            res.redirect('/authors')
        }
        

    } catch (error) {
        if(author == null){
            res.redirect('/')
        }
        else{
            res.redirect(`/authors/${author.id}`)
        }
    }
}) // What resource to delete

module.exports = router

