const mongoose = require('mongoose')// middleware for the connection to the database 
const {MONGO_URL} = process.env// the url taken from the .env file for the mongodb connection

exports.connect = () => 
{
    mongoose.connect(MONGO_URL, // connecting using the mongo url 
        {
        useNewURlParser : true, // TOSTUDY : certain requirements for the url ?
        useUnifiedTopology : true 
        }).then( // if connection is true 
        console.log('DB Connected Successfully')
    ).catch(error => {
        console.log ("DB Connection failed"); // when connection fails
        console.log(error);
        process.exit(1)
    })
}
// TOSTUDY : why the .env file is required ?