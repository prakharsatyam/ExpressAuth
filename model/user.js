const mongoose = require ('mongoose')
//we create the type of data which can be stored in the database
const userSchema = new mongoose.Schema({ // The schema is created using mongoose 
    firstname : {
        type : String ,
        default : "jhon"
    }, //  the different fields of a single data object 
    lastname : {
        type : String ,
        default : "doe"
    },
    email : {
        type : String ,
        unique : true,
        required : [true , 'please enter it '] 
    },
    password : {
        type : String,
    },
    token : {
        type : String,
    }
})
module.exports = mongoose.model('user', userSchema) // here we choose what we export from this specific file in this case we export the schema of user mmodel  
// TOSTUDY : these are just properties of the models. A model can also have various behaviours which can be defined using functions