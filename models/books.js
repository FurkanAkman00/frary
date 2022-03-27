const mongoose = require('mongoose')
const path = require('path')


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    pageCount: {
            type: Number,
            required: true
    },

    description: {
        type: String
    },

    publishDate: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    coverImage: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId, // We are referencing other object in mongoose we created
        required: true,
        ref: 'Author' // This must match with the model. we are referencing object id right here we are telling that objectID = Author
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null){
        return path.join('/','uploads/bookCovers',this.coverImage)
    }
})

module.exports = mongoose.model('Book',bookSchema)
