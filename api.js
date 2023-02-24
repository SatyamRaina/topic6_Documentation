/*
Name: Satyam Raina
Roll No.: 2110994809
*/

//Include mongoose package
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://SatyamRaina:howzuhbuddy312003@cluster0.akkop4z.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');

//Including the device model
const Device = require('./models/device');

const app = express();

//Importing 'body-parser' module into the current file
const bodyParser = require('body-parser');

//Instructing Express app to use 'body-parser' middleware to parse incoming HTTP requests with URL-encoded payloads(extended: false --> tells not any type for encoded data other than string or arrays)
app.use(bodyParser.urlencoded({ extended: false }))

//Parse HTTP requests with JSON payloads
app.use(bodyParser.json())

//Cross-Origin resource sharing(CORS)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 5000;

app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

//Documentation
/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*  [
*    {
*      "_id": "dsohsdohsdofhsofhosfhsofh",
*      "name": "Mary's iPhone",
*      "user": "mary",
*      "sensorData": [
*        {
*          "ts": "1529542230",
*          "temp": 12,
*          "loc": {
*            "lat": -37.84674,
*            "lon": 145.115113
*          }
*        },
*        {
*          "ts": "1529572230",
*          "temp": 17,
*          "loc": {
*            "lat": -37.850026,
*            "lon": 145.117683
*          }
*        }
*      ]
*    }
*  ]
* @apiErrorExample {json} Error-Response:
*  {
*    "User does not exist"
*  }
*/

//Using built-in middleware function to serve static files in public directory
app.use(express.static(`${__dirname}/public/generated-docs`));

//Adding an endpoint for documentation page
app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

//Add an API endpoint to retrieve all devices
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    if (err == true) {
      return res.send(err);
    } else {
      return res.send(devices);
    }
  });
});

//Creates a new device schema object that is ready to write to the Mongo DB.
app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
  });
});

app.listen(port, () => {
  console.log(`listening to port ${port}`)
});