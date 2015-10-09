var TermostatModel = require('./../models/termostat');
var EventEmitter = require('events').EventEmitter;
var gpio = require('./gpio');

function Termostat(){
  this.auto = false;
  this.temperature = 0.0;
  this.termostat = 23.0;//termperature to guard for the termostat
  this.hysteresis = 1.0;
  this.humidity = 100.0;
  this.manualSwitch= false;//used to switch pin2 manualy
  this.termostatSwitch = false; //used switch pin 1 manualy/automatically
  this.manualSwitchPin = 13;//pin used in physical order 
  this.termostatSwitchPin = 11; //pin used in physical order 
}

Termostat.prototype = new EventEmitter();

Termostat.prototype.init = function(){//init returns json for the api/setup to use it as response
  var self = this;
  TermostatModel.find({}, function(err, out){
    if(err) throw err;

    if(out.length) {//if database exists, read it
      self._id = out[0]._id;
      self.auto = out[0].auto;
      self.termostat = out[0].termostat;
      self.hysteresis = out[0].hysteresis;
      self.setManualSwitch(out[0].manualSwitch);
      self.manualSwitchPin = out[0].manualSwitchPin;
      self.setTermostatSwitch(out[0].termostatSwitch);
      self.termostatSwitchPin = out[0].termostatSwitchPin;
    }
    else{//if does not exist, we setup the database
      var tmp = new TermostatModel({
        auto: self.auto,
        termostat: self.termostat,
        hysteresis: self.hysteresis,
        manualSwitch: self.manualSwitch,
        manualSwitchPin: self.manualSwitchPin,
        termostatSwitch: self.termostatSwitch,
        termostatSwitchPin: self.termostatSwitchPin
      });
      
      tmp.save(function(err){
        if(err){
	  console.error(err);
	  throw err;
	}
        else console.log('database initialised');
      });
    }
  });

  self.on('temperatureChange', function(){
    console.log('teplota sa zmenila');
  });
  self.on('humidityChange', function(){
    console.log('vlhkost sa zmenila');
  });
};


Termostat.prototype.getMode = function(){
  return this.auto;
};
Termostat.prototype.getTemperature = function(){
  return this.temperature;
}
Termostat.prototype.getTermostat = function(){
  return this.termostat;
}
Termostat.prototype.getHysteresis = function(){
  return this.hysteresis;
}
Termostat.prototype.getHumidity = function(){
  return this.humidity;
}
Termostat.prototype.getManualSwitch = function(){
  return this.manualSwitch;
}
Termostat.prototype.getTermostatSwitch = function(){
  return this.termostatSwitch;
}
Termostat.prototype.getTermostatId = function(){
  return this._id;
}

function mongodbWriteHelper(object, varToSave){
  TermostatModel.findById(object._id, function (err, doc){
    debugger;
    doc[varToSave] = object[varToSave];
    doc.save(function (err){
      if(err) throw err;
    });
  });
}

Termostat.prototype.setMode = function(mode){
  if(mode === 'true') this.auto = true;
  else if(mode === 'false')this.auto = false;
  else return new Error('the atribute value is not in correct format');
  mongodbWriteHelper(this,'auto');
};
Termostat.prototype.setTemperature = function(temperature){
  this.temperature = Number(temperature);
}
Termostat.prototype.setTermostat = function(termostat){
  this.termostat = Number(termostat);
  mongodbWriteHelper(this,'termostat');
}
Termostat.prototype.setHysteresis = function(hysteresis){
  this.hysteresis = Number(hysteresis);
  mongodbWriteHelper(this,'hysteresis');
}
Termostat.prototype.setHumidity = function(humidity){
  this.humidity = Number(humidity);
}
Termostat.prototype.setManualSwitch = function(manualSwitch){
  //if(manualSwitch === 'true') this.manualSwitch = true;
  //else if(manualSwitch === 'false')this.manualSwitch = false;
  //else return new Error('the atribute value is not in correct format');
  //mongodbWriteHelper(this,'manualSwitch');
  if(manualSwitch === 'true') manualSwitch = true;
  else if(manualSwitch === 'false')manualSwitch = false;
  else return new Error('the atribute value is not in correct format');
  gpio.write(this.manualSwitchPin, manualSwitch)
  .then(function(){
    this.manualSwitch = gpio.read(this.manualSwitchPin);
    debugger;
  });
}

Termostat.prototype.setTermostatSwitch = function(termostatSwitch){
  if(termostatSwitch === 'true') this.termostatSwitch = true;
  else if(termostatSwitch === 'false')this.termostatSwitch = false;
  else return new Error('the atribute value is not in correct format');
  mongodbWriteHelper(this,'termostatSwitch');
  gpio.write(this.termostatSwitchPin, this.termostatSwitch);
  this.termostatSwitch = gpio.read(this.termostatSwitchPin);
}

module.exports = Termostat;
