const express = require('express');
const router = express.Router();
const bodyParser= require('body-parser')

router.get("/",(req, res) =>{
    res.render('login');
});


const users = [];

router.get('/users', (req, res) => {
    res.json(users)
})

router.post('/', async (req,res) => {
    const username = await req.body.username;
    // if name coresponds to database name, then check password
    //if not then throw an error
    //then check password thru db
    console.log(username);
})



//just some random code for future JWS
router.post('/',  async (req, res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);
        console.log(hash)
        console.log(salt)
  
        const user = {name: req.body.name, password: hash};   
        users.push(user);
        res.status(201).send();
    }
    catch{
        res.status(500).send();

    }
})






module.exports = router;