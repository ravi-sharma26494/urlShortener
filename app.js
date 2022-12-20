const express = require('express');
const mongoose = require('mongoose');
const app = express();
//model
const ShortUrl = require('./models/shortURL');

const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname,'views'))


//db connection
mongoose.connect('mongodb://localhost:27017/urlshortener', {
    useNewUrlParser:true, useUnifiedTopology:true
})
.then((result) => {
    console.log('Connected to the Database')
}).catch((err) => {
    console.log(`Error while connecting to the database : ${err}`)
});

//routes
app.get('/', async(req, res)=>{
const shortUrls  = await ShortUrl.find();
res.render('index', {shortUrls: shortUrls})
});

app.post('/shortUrls', async(req,res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/');
});

app.get('/:shortUrl',async(req, res)=>{
    const shortUrl = await ShortUrl.findOne({ short:req.params.shortUrl });
    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})
app.listen(PORT, ()=> console.log(`Server is up at: ${PORT}`))