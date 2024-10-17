const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const URI = process.env.MONGO_URI;
const Connection = async () => {
  
    try{
        await mongoose.connect(URI, {useNewUrlParser: true});
        console.log("Database connected successfully");
    }catch(err){
        console.log("Error while connecting to database", err);
    }
}

module.exports = Connection;