const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
var TeleSignSDK = require('telesignsdk');

const Sensors = require('../models/sensors');
const RoomDetails = require('../models/roomDetails');


router.post('/addSensor',async (req,res,next)=>{

console.log(req.body);

let {active,floorNo,roomNo,smokeLevel,co2Level} = req.body;

 let count = (floorNo + roomNo);

 let data = {
    id :count,
    active:active ,
    floorNo :floorNo ,
    roomNo : roomNo,
    smokeLevel :smokeLevel,
    co2Level : co2Level
};
  
console.log('data',data);
  

  try{
    const response = await Sensors.create(data);

  res.send(JSON.stringify({success:"sensor added" , code : 'reg', sensor : response} ));
  }
  catch(e){
    console.log(e);
  }

});


router.patch('/updateSensor/:id',async (req,res,next)=>{

  console.log(req.body);

 try{
   
  const updatedSensor = await Sensors.updateOne(
{"id" :req.params.id},
  {
    $set: {"active":req.body.active,"floorNo" :req.body.floorNo,
  
    "roomNo" : req.body.roomNo,"smokeLevel":req.body.smokeLevel,"co2Level":req.body.co2Level}
  }

);

   res.json(updatedSensor);


    
  }
  catch(e){
    console.log(e);
  }

});

router.post('/updateSensors/:id',async (req,res,next)=>{

  console.log(req.body);

 try{
   
  const updatedSensor = await Sensors.updateOne(
{"id" :req.params.id},
  {$set: {"smokeLevel":req.body.smokeLevel,"co2Level":req.body.co2Level}}

);

   res.json(updatedSensor);


    
  }
  catch(e){
    console.log(e);
  }

});

router.delete('/deleteSensor/:id',async (req,res,next)=>{

 

try{

  const response = await Sensors.deleteOne({id : req.params.id});

  res.json(response);

}
catch(e){
  console.log(e);
}

});

router.get('/getAllSensors',async (req,res,next)=>{

  try{
  
    const response = await Sensors.find();
  
    res.json(response);
  
  }
  catch(e){
    console.log(e);
  }
  
  });
  

  router.post('/addRoomDetails',async (req,res,next)=>{


  let {floorNo,roomNo,customerPhone,customerMail} = req.body;
  
   let count = (floorNo + roomNo);
  
    console.log('count',count);
  
    let data = {
      id :count,
      floorNo :floorNo ,
      roomNo : roomNo,
      customerPhone :customerPhone,
      customerMail : customerMail
  };
    
  console.log('data',data);
    
  
    try{
      const response = await RoomDetails.create(data);
  
  
      res.send(JSON.stringify({success:"sensor added" , code : 'reg', room : response} ));
    }
    catch(e){
      console.log(e);
    }
  
  });

router.get('/getRoomDetails/:id',async (req,res,next)=>{

    try{
    
      const response = await RoomDetails.findOne({"id" : req.params.id});
    
      res.json(response);
    
    }
    catch(e){
      console.log(e);
    }
    
    });


router.post('/sendEmail',async (req,res,next)=>{

  const receiverEmail = req.body.receiverEmail;
  const senderMail = ''; // add sender email 
  const password = ''; // add password

  // allow less secure feature on in chrome
  // link - https://myaccount.google.com/lesssecureapps

try{

    
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: senderMail, 
    pass: password,
  },
  tls:{
      rejectUnauthorized : false
  }
});
let HelperOptions =  { from: senderMail, // sender address
to: receiverEmail, // list of receivers
subject: "Warning Message", // Subject line
text: "", // plain text body
html: `
<h3>Sensor Details</h3>
<li>location: ${req.body.location}</li>
<li>CO2 level: ${req.body.co2Level}</li>
<li>H20 level: ${req.body.h2oLevel}</li>
<h3>Message</h3>
<p>${req.body.message}</p>`
};
transporter.sendMail(HelperOptions,(error,info) =>{
  if(error){
      return console.log(error);
  }
  console.log("The message was sent!");
  console.log(info);

  res.json(info);
});

}
catch(e){
    console.log(e);
}
});

router.post('/sendSMS',async (req,res,next)=>{

  const receiverPhoneNo = req.body.phoneNo;

try{
  
  var TeleSignSDK = require('telesignsdk');

  const customerId = "BA490AC9-577B-4672-BEC5-82738279459B";
  const apiKey = "SBnLkkwV2qXumscFRtQWcQmCGgmGMK1jy+57YYhNSDcV9+tnHybgAUyC1VYhAx84XQdw8Aye0e+7OmopDsy6oA==";
  const rest_endpoint = "https://rest-api.telesign.com";
  const timeout = 10*1000; // 10 secs

  const client = new TeleSignSDK( customerId,
      apiKey,
      rest_endpoint,
      timeout // optional
      // userAgent
  );

  
  const message = "SENSOR WARNING MESSAGE ------ TAKE A ACTION SOON ";
  const messageType = "ARN";

  console.log("## MessagingClient.message ##");

  function messageCallback(error, responseBody) {
      if (error === null) {
          console.log(`Messaging response for messaging phone number: ${receiverPhoneNo}` +
              ` => code: ${responseBody['status']['code']}` +
              `, description: ${responseBody['status']['description']}`);

              res.json('send sms successfully');
      } else {
          console.error("Unable to send message. " + error);
      }
  }
  client.sms.message(messageCallback, receiverPhoneNo, message, messageType);
  
} 
catch(e){
console.log(e);
}

});

module.exports = router;

