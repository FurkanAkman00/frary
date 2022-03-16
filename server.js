if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts")
const mongoose = require('mongoose')
const bp = require('body-parser')

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',() => console.log('connected to mongose'))

app.set("view engine","ejs")
app.set('views',__dirname + "/views")
app.set('layout',"layouts/layout")
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bp.urlencoded({limit:'10mb',extended:false}))  // useless shit but body parser is needed

const indexRouter = require('./routes/index')
app.use('/',indexRouter)

const authorRouter = require('./routes/authors')
app.use('/authors',authorRouter)


app.listen(process.env.PORT || 3000)
