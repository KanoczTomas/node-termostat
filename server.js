var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser  = require('body-parser');
var app = express();
var spawn = require('child_process').spawn;
var child = spawn('sudo', ['node', 'sensor.js' ]);
var TermostatModel = require('./js/models/termostat');
var mongoose = require('mongoose');
var config = require('./js/config');
var Termostat = require('./js/objects/termostat');
//emit an event on termperature change and only if auto mode if on 
mongoose.connect(config.database);

var termostat = new Termostat();
termostat.init();

process.on('SIGINT',function(){
  termostat.close();
  process.exit();
});

app.use(morgan('dev'));
app.use(compress());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.listen(5000);

console.log('server running');

//function resGet(url,object,getMethod){
//  app.get('/api/' + url, function(req, res){
//    res.json(object[getMethod]());
//  });
//}

//resGet('mode',termostat,'getMode');
//resGet('temperature',termostat,'getTemperature');
//resGet('termostat',termostat,'getTermostat');
//resGet('hysteresis',termostat,'getHysteresis');
//resGet('humidity',termostat,'getHumidity');
//resGet('manualSwitch',termostat,'getManualSwitch');
//resGet('termostatSwitch',termostat,'getTermostatSwitch');
//resGet('id',termostat,'getTermostatId');
//resGet('init',termostat,'init');

app.get('/api/state', function(req, res){
  res.json(termostat);
});

setInterval(function(){
  termostat.getTermostatSwitch()
  .then(function(out){
    termostat.termostatSwitch = out;
    return termostat.getManualSwitch();
  })
  .then(function(out){
    termostat.manualSwitch = out;
    console.log('finished reading real values');
  });
  console.log('reading real values');
},2000);

function resPost(url,object,setMethod){
  app.post('/api/' + url + '/:value', function(req, res){
    var value = req.params.value;
    console.log('use auth middleware here');
    object[setMethod](value);
    res.json({success: true});
  });
}

resPost('auto',termostat,'setMode');
resPost('termostat',termostat,'setTermostat');
resPost('hysteresis',termostat,'setHysteresis');
resPost('manualSwitch',termostat,'setManualSwitch');
resPost('termostatSwitch',termostat,'setTermostatSwitch');

child.on('error', function(err){
  console.log(err);
});

child.stdout.on('data', function(data){
  var output = data.toString().trim().split(',');
  var temperature = Number(output[0]);
  var humidity = Number(output[1]);
  if(temperature != termostat.getTemperature()){
    termostat.setTemperature(temperature);
    termostat.emit('temperatureChange');
  }
  if(humidity != termostat.getHumidity()){
    termostat.setHumidity(humidity);
    //termostat.emit('humidityChange'); //- not using humidity, but left as a place holder
  }
});


