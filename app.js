const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');


const dbURI = 'mongodb+srv://<Auth-Sentinel>:<RealNameObserver1>@cluster0.k2tvnwz.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
app.listen(3000)
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));