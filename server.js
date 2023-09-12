const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const auth = require('./public/routes/auth');
const app = express();

app.use(express.json());
// view engine setup
app.set('views', path.join(__dirname + "/public", 'views'));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, 'public')));
app.get("/",(req, res) =>{
    res.render('index');
});

app.use('/auth', auth);

app.listen(3000)