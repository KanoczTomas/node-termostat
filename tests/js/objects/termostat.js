var Termostat = require('../../../js/objects/termostat');
var should = require('should');

termostat = new Termostat();
termostat.auto = false;
termostat.temperature = 0.0;
termostat.termostat = 23.0;//termperature to guard for the termostat
termostat.hysteresis = 1.0;
termostat.humidity = 100.0;
termostat.manualSwitch= false;//used to switch pin2 manualy
termostat.termostatSwitch = false; //used switch pin 1 manualy/automatically
termostat.manualSwitchPin = 13;//pin used in physical order 
termostat.manualSwitchPinLock = false;//if we are doing an operation with the pin, we need to lock it
termostat.termostatSwitchPin = 11; //pin used in physical order 
termostat.termostatSwitchPinLock = false; //if we are doing an operation with the pin, we need to lock it
termostat.flipable = 0; //helper variable for auto mode -1 below treshold and hystereses, 0 between, 1 above

describe('getMethods', function(){
  describe('getMode()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getTemperature()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getTermostat()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getHysteresis()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getHumidity()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getManualSwitch()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getTermostatSwitch()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getManualSwitchPin()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getManualSwitchPinLock()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getTermostatSwitchPin()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getTermostatswitchpinlock()',function(){
      it('should return value of ', function(){
      });
  });
  describe('getFlipable()',function(){
      it('should return value of ', function(){
      });
  });
});
