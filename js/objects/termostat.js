var TermostatModel = require('./../models/termostat');
var EventEmitter = require('events').EventEmitter;
var gpio = require('./gpio');
var control = require('./control');

function Termostat(){
  this.auto = false;
  this.temperature = 0.0;
  this.termostat = 23.0;//termperature to guard for the termostat
  this.hysteresis = 1.0;
  this.humidity = 100.0;
  this.manualSwitch= false;//used to switch pin2 manualy
  this.termostatSwitch = false; //used switch pin 1 manualy/automatically
  this.manualSwitchPin = 13;//pin used in physical order 
  this.manualSwitchPinLock = false;//if we are doing an operation with the pin, we need to lock it
  this.termostatSwitchPin = 11; //pin used in physical order 
  this.termostatSwitchPinLock = false; //if we are doing an operation with the pin, we need to lock it
  this.flipable = 0; //helper variable for auto mode -1 below treshold and hystereses, 0 between, 1 above
}

Termostat.prototype = new EventEmitter();

Termostat.prototype.init = function(){//init returns json for the api/setup to use it as response
  var self = this;
  
  gpio.init(self.manualSwitchPin)
  .then(function(){
    return gpio.init(self.termostatSwitchPin)
  })
  .then(function(){
    console.log('pins set up for use');
  })
  .error(function(array){
    var err = array[0];
    var pin = array[1];
    console.error(err);
    console.log('found error on pin ' + pin + ' retryint init');
    gpio.close(pin)
    .then(function(){
      self.init();
    });
  });

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
    control(self);
  });
  self.on('humidityChange', function(){
    console.log('vlhkost sa zmenila');
  });
};

Termostat.prototype.close = function (){
  var self = this;
  gpio.close(self.termostatSwitchPin)
  .then(function(){
    gpio.close(self.manualSwitchPin)
    .then(function(){
      console.log('all pins closed, ready to shut down');
    });
  })
};

function variableChangeHelper(var1, var2){//return true if variable changed, else false
  if(var1 === var2)return false;
  return true;
}


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
  //return this.manualSwitch;
  return gpio.read(this.manualSwitchPin);
}
Termostat.prototype.getTermostatSwitch = function(){
  //return this.termostatSwitch;
  return gpio.read(this.termostatSwitchPin);
}

Termostat.prototype.getManualSwitchValue = function(){
  return this.manualSwitch;
}
Termostat.prototype.getTermostatSwitchValue = function(){
  return this.termostatSwitch;
}
Termostat.prototype.getTermostatId = function(){
  return this._id;
}

function mongodbWriteHelper(object, varToSave){
  TermostatModel.findById(object._id, function (err, doc){
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
  control(this);
};
Termostat.prototype.setTemperature = function(temperature){
  this.temperature = Number(temperature);
}
Termostat.prototype.setTermostat = function(termostat){
  this.termostat = Number(termostat);
  mongodbWriteHelper(this,'termostat');
  control(this);
}
Termostat.prototype.setHysteresis = function(hysteresis){
  this.hysteresis = Number(hysteresis);
  mongodbWriteHelper(this,'hysteresis');
}
Termostat.prototype.setHumidity = function(humidity){
  this.humidity = Number(humidity);
}
Termostat.prototype.setManualSwitch = function(manualSwitch){
  if(variableChangeHelper(this.manualSwitch, manualSwitch)){
    if(typeof(manualSwitch) === 'boolean') this.manualSwitch = manualSwitch;
    else{
      if(manualSwitch === 'true') this.manualSwitch = true;
      else if(manualSwitch === 'false')this.manualSwitch = false;
      else return new Error('the atribute value is not in correct format');
    }
    mongodbWriteHelper(this,'manualSwitch');
    gpio.write(this.manualSwitchPin, this.manualSwitch);
  }
//  if(manualSwitch === 'true') manualSwitch = true;
//  else if(manualSwitch === 'false')manualSwitch = false;
//  else return new Error('the atribute value is not in correct format');
//  gpio.write(this.manualSwitchPin, manualSwitch)
//  .then(function(){
//    this.manualSwitch = gpio.read(this.manualSwitchPin);
//    debugger;
//  });
}

Termostat.prototype.setTermostatSwitch = function(termostatSwitch){
  if(variableChangeHelper(this.termostatSwitch,termostatSwitch)){
    console.log('this is inside set: ' + termostatSwitch);
    if(typeof(termostatSwitch) === 'boolean') this.termostatSwitch = termostatSwitch;
    else{
    if(termostatSwitch === 'true') this.termostatSwitch = true;
    else if(termostatSwitch === 'false')this.termostatSwitch = false;
    else console.error( new Error('the atribute value is not in correct format'));
    }
    mongodbWriteHelper(this,'termostatSwitch');
    gpio.write(this.termostatSwitchPin, this.termostatSwitch);
  }
}

module.exports = Termostat;
