const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://ayush230830patel:eXiA2zPAZjOTHT6P@cluster1.4ordizv.mongodb.net/Table';

const DBConnect = ()=> {
    mongoose.connect(mongoURI).then(()=> {
        console.log("Conected to Database successfully")
    })
}
 module.exports =  DBConnect