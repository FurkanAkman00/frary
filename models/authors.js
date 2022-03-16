const mongoose = require('mongoose')    // You are creating schema for author object

// This is basically what you wanna store in author. And
// what are you gonna store in this variable

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author',authorSchema)