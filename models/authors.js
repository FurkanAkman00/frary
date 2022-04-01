const mongoose = require('mongoose')    // You are creating schema for author object
const Book = require('./books')

// This is basically what you wanna store in author. And
// what are you gonna store in this variable

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

/// authorSchema.pre("deleteOne",function (next) {
    // Book.find({ author: this.id}, (err,books) =>{
        // if(err){
          //  next(err)
        //} else if(books.length > 0) {
          //  next(new Error('This author has books still'))
        //} else{
       //     next()
     //   }
   // })
// });

module.exports = mongoose.model('Author',authorSchema)