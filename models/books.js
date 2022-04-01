const mongoose = require('mongoose')

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
        type: Buffer,
        required: true
    },

    coverImageType: {
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
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${
            this.coverImage.toString('base64')}` // Take buffer object as image source we do not use path anymore with filepond its so ez
    }
})

module.exports = mongoose.model('Book',bookSchema)
