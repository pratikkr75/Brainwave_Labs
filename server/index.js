const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Connection = require('./database/db');
const app = express();
dotenv.config();

const PORT = process.env.port;
app.use(cors());
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`)
})

Connection();