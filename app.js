require("dotenv").config() // the required variables for the connection the config() helps us to configure the location of the .env file among other things
require('./config/database').connect(); // connecting to the database

const express = require('express');// required for backend and middleware
const User = require('./model/user');// required for the user schema and perform operations on the data from database 
const bcrypt = require ('bcryptjs');// required for storing data on the database in an encrypted format
const jwt = require('jsonwebtoken');// token generation used for 
const auth = require ("./middleware/auth");
const cookieParser = require('cookie-parser')

const app = express();

 app.use(express.json())
app.use(cookieParser());
 app.get("/",(req,res) =>{
    res.send("<h1>hello from auth system </h1>")
 })


 app.post("/register",async (req, res) => {
   try {
      const {firstname , lastname , email , password} = req.body;
      if (!(email && password && firstname &&lastname)){
          res.status(400).send('all fields are required')
      }
      const existinguser = await User.findOne({email});
      if (existinguser)
      {
        res.status(401).send("User exists");
      }
      const MyEncPass = await bcrypt.hash(password, 10);
     const user = await User.create({
        firstname,
        lastname,
        email : email.toLowerCase(),
        password :MyEncPass
      })
  
      const token = jwt.sign({user_id : user._id, email}
        ,process.env.SECRET_KEY,
        {expiresIn : "2h"}
     )
     user.token = token
     res.status(201).json(user);
   //   user.password = undefined
  
   } catch (error) {
      console.log(error);
   }
 })


 app.post("/login", async (req,res) => {
  try {
    const {email,password} = req.body;
    if (!(email && password))
    {
      res.status(400).send("Enter the required information")
    }
    const user = await User.findOne({email})
    if ((user && await bcrypt.compare(password, user.password)))
    {
      const token =jwt.sign(
        {user_id : user._id , email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h"
        }
      )
      user.token = token 
      user.password = undefined 
      //res.status(200).json(user)
      const options = {
        expires: new Date(Date.now()+ 3 *24 * 60 *60 *1000),
        httpOnly: true,
      };
      res.status(200).cookie('token',token,options).json({
        success: true,
        token,
        user,
      })
    }
    res.status(400).send("email or password is incorrect")

  } catch (error) {
    console.log(error);
  }
 }) 
 
 app.get("/dashboard",auth, (req,res) => {

  res.status(200).send(`<h1>hello to your dashboard mr </h1>`)
})


 module.exports = app