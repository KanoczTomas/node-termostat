var gpio = require('pi-gpio');
var Promise = require('bluebird');

module.exports = {
  write: function(pin,state){
    return new Promise(function(resolve, reject){
      gpio.open(pin, 'out', function(err){
        if (err) reject(err);
        gpio.write(pin , state ? 0 : 1, function(err){
          if(err) reject(err);
          gpio.close(pin);
	  resolve();
        });
      });
    });
  },
  read: function(pin){
    var tmp;
    gpio.open(pin, 'out', function(err){
      if(err) console.log(err);
      gpio.read(pin, function( err, out){
        gpio.close(pin);
	tmp = !Boolean(out);
      });
    });
    return tmp;
  }
}
