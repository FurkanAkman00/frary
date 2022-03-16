const express = require('express');
const app = express()
const router = express.Router();
const Author = require('../models/authors') //This is important i imported authors you have to

// All author route
router.get('/',async (req,res) =>{
    
    let searchOptions = {}

    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name , 'i')  // Bunch of useless bullshit

    }

    try {
        
        const authors = await Author.find(searchOptions)   // I wanna get all the authors here thats why the empty object
        
        res.render('authors/index',{
            authors:authors})

    } catch (error) {
        console.log('yelo')
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

        res.redirect('authors')

    } catch (error) {
        res.render('authors/new',{
             author: author,
             errorMessage: 'Error creating author'
            })
    }
})

module.exports = router

