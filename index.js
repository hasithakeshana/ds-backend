const express = require('express');
const routes = require('./routes/api');
require('dotenv').config();

const mongoose = require('mongoose');

var cors = require('cors');

const app = express();

app.use(cors());

// connect to mongodb
//mongoose.connect('mongodb://localhost/DSAssignment');
mongoose.Promise = global.Promise;

const uri = "mongodb+srv://rashmika:Rashmika@fashionstore-k14re.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true   , useFindAndModify: false},()=>{

    console.log("DB connected");
});


app.use(express.json());  //  useNewUrlParser: true, useFindAndModify: false

app.use(express.urlencoded({extended:true}));

app.use('/',routes);


app.listen( process.env.PORT || 4000,function(){

    console.log('now listening for requests');
    console.log('xx');
});

