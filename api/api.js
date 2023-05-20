const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device'); 

mongoose.connect('mongodb+srv://omkar07ml:omkar07ml@cluster0.hiwdauw.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    if (err == true) {
      return res.send(err);
    } else {
      return res.send(devices);
    }
  });
});
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


app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});


client.on('message', (topic, message) => {
  if (topic == '/sensorData') {
    const data = JSON.parse(message);

    Device.findOne({"name": data.deviceId }, (err, device) => {
      if (err) {
        console.log(err)
      }

      const { sensorData } = device;
      const { ts, loc, temp } = data;

      sensorData.push({ ts, loc, temp });
      device.sensorData = sensorData;

      device.save(err => {
        if (err) {
          console.log(err)
        }
      });
    });
  }
});

app.put('/sensor-data', (req, res) => {
  const { deviceId }  = req.body;

  const [lat, lon] = randomCoordinates().split(", ");
  const ts = new Date().getTime();
  const loc = { lat, lon };
  min = Math.ceil(20);
  max = Math.floor(50);
  temp = Math.floor(Math.random() * (max - min + 1) + min);

  const topic = `/sensorData`;
  const message = JSON.stringify({ deviceId, ts, loc, temp });

  client.publish(topic, message, () => {
    res.send('published new message');
  });
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
