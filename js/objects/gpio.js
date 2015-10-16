var gpio = require('pi-gpio');
var Promise = require('bluebird');

module.exports = {
  init: function(pin){
    return new Promise(function (resolve, reject){
      gpio.open(pin, 'out', function(err){
        if(err) reject([err,pin]);//returning an array with the pin, so Termostat.init() can use it to initialise again in case of a failure
        resolve();
      });
    });
  },
  close: function(pin){
    return new Promise(function (resolve, reject){
      gpio.close(pin, function(err){
        if(err) reject(err);
	resolve();
      });
    });
  },
  write: function(pin,state){
    var self = this;
    return new Promise(function(resolve, reject){
      gpio.write(pin , self.inverse ? Number(!state) : Number(state), function(err){
        if(err) reject(err);
        resolve();
      });
    });
  },
  read: function(pin){
    var self = this;
    return new Promise(function(resolve, reject){
      gpio.read(pin, function( err, out){
        if(err) reject(err);
        resolve(self.inverse ? !Boolean(out) : Boolean(out));
      });
    });
  },
  inverse: true
}
