const express = require('express');
const router = express.Router();
const bodyParser= require('body-parser')
const { MongoClient } = require('mongodb')
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

//defining db connection
const uri = "mongodb+srv://Auth-Sentinel:wfh5m63jk@cluster0.k2tvnwz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

//rendering the site
router.get("/",(req, res) =>{
    res.render('auth');
});


//POST TO LOGIN
router.post('/', async (req, res) => {
    await connectToDb().catch(console.error);
    const { email, password, } = req.body;

    if(await client.db('index-auth').collection('users').findOne({email: email})){
        console.log("this email exists in db");
        const foundUser = await client.db('index-auth').collection('users').findOne({email: email})
        const datetime = foundUser.dateOfCreation;
        if( await bcrypt.compare(password, foundUser.password)){
            const token = await JWT.sign({datetime}, 'b92hr0dowqqhya932kqj')
            res.json({token, datetime})

        }else{
        console.log("wrong password")
        }
    }else{
    console.log("no such user exists // bad email")
    }

});




//SIGNUP ROUTE
// credentials check for signup
router.post('/signup',
[check('email', "Please enter a valid email").isEmail(), check('password', "Please enter a valid password").isLength({ min: 6, max: 20})],
async (req,res) => {
    const { email, password } = req.body;
    
    const errors = validationResult(req);
    
    //if theres errors, throws error with array of errors
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
        
    }
    //connecting and searching for an email coresponding to post req
    await connectToDb().catch(console.error);
    const foundEmail = await client.db('index-auth').collection('users').findOne({email: email});
    
    if(!foundEmail){
        console.log("No user exists, creating the user")
        createUser(res, password, email);
        
    }else{
        
        if(email != foundEmail.email){
            
            createUser(res, password, email);
            
        }else{
            res.send("User with such email already exists");
        }
    }

});

//connecting to db
async function connectToDb()
{
    try{
        await client.connect();
        
    }catch(e){
        console.error(e);
        
    }
}

async function createUser(res, password, email){
    
        // hashing the pw
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
                
        console.log(hash)
        console.log(salt)  

        const datetime = new Date()
        console.log(datetime)
        //Creates a "member" user in DB
        await client.db('index-auth').collection('users').insertOne({email: email, password: hash, role: 'Member', dateOfCreation: datetime});
        console.log(email, password);

        const token = await JWT.sign({datetime}, 'b92hr0dowqqhya932kqj')
        res.json({token, datetime})

}






module.exports = router;