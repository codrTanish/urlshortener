const mongoose = require('mongoose')
const randomString = require('randomstring')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()      
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// @BaseUrl
const baseUrl = 'https://srtfyjs.herokuapp.com/'

// @mongoose: Connecting To DB
mongoose.connect('mongodb+srv://tanishghosh:tanishghosh012@cluster0.uqjih.mongodb.net/mern?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=> console.log('DB Connected')).catch((err)=> console.log(err))

const dbSchema = mongoose.Schema({
    org_url: String,
    shorten_url: String
})

const Data = mongoose.model('UrlShortener', dbSchema)

// @Redirecting: For redirecting users 
app.get('/:url',  (req, res)=>{
    const url = req.params.url
    Data.findOne({shorten_url: url}).then((data)=>{
        res.redirect(`http://${data.org_url}`)
    }).catch((err)=> console.log(err))
})

// @Adding/Creating: For Adding URLs To The DataBase
app.post('/shorten/:url',  async (req, res)=>{
    const url = req.params.url
    // res.json({
    //     "orinalUrl": url,
    //     "received" : 'Received'
    // })
    const shorten_url = randomString.generate(7)
    const post = new Data({
        org_url: url, shorten_url: shorten_url
    })

    try {
        await post.save()
        res.json({
            "orignalUrl": url,
            "shortenUrl": `${baseUrl}${shorten_url}`
        }).end()
    } catch (error) {
        console.log(error);
        res.end(error)
    }
})

app.get('/test',(req, res)=>{
    res.send("Hello World")
})

app.listen(port, ()=>{
    console.log(`Server Started At PORT ${PORT}`)
})
