if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts")
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://usera:DQcr3a1FR6uvxSB5@cluster0.nrggb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',() => console.log('connected to mongose'))

app.set("view engine","ejs")
app.set('views',__dirname + "/views")
app.set('layout',"layouts/layout")
app.use(expressLayouts)
app.use(express.static('public'))

const indexRouter = require('./routes/index')
app.use('/',indexRouter)


app.listen(process.env.PORT || 3000)
