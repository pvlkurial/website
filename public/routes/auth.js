const express = require('express');
const router = express.Router();
const bodyParser= require('body-parser')
const { MongoClient } = require('mongodb')
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

//defining db connection
const uri = "mongodb+srv://Auth-Sentinel:wfh5m63jk@cluster0.k2tvnwz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

router.get("/",(req, res) =>{
    res.render('auth');
});
//function call of connecting to db

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

        // hashing the pw
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        console.log(hash)
        console.log(salt)  

        //Creates a user in DB
        await client.db('index-auth').collection('users').insertOne({email: email, pswrd: hash, role: 'Member'});
        res.send("User Created");
        console.log(email, password);

    }else{

        if(email != foundEmail.email){

            // hashing the pw
            const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password, salt);
                
                console.log(hash)
                console.log(salt)  

                //Creates a user in DB
                await client.db('index-auth').collection('users').insertOne({email: email, pswrd: hash, role: 'Member'});
                res.send("User Created");
                console.log(email, password);
            
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






module.exports = router;