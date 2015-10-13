var Termostat = require('../../../js/objects/termostat');
var should = require('should');
var gpio = require('pi-gpio');

termostat = new Termostat();

describe('getMethods', function(){

beforeEach(function(){
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
  termostat._id = 123123123; //helper variable for auto mode -1 below treshold and hystereses, 0 between, 1 above
});

  describe('getMode()',function(){
      it('should return value of auto atribute', function(){
        termostat.getMode().should.be.false();
	termostat.auto = true;
	termostat.getMode().should.be.true();
      });
  });
  describe('getTemperature()',function(){
      it('should return value of temperature atribute', function(){
        termostat.getTemperature().should.be.equal(0).and.be.a.Number();
	termostat.temperature = 5;
	termostat.getTemperature().should.be.equal(5).and.be.a.Number();
      });
  });
  describe('getTermostat()',function(){
      it('should return value of termostat atribute', function(){
        termostat.getTermostat().should.be.equal(23).and.be.a.Number();
	termostat.termostat = 55
        termostat.getTermostat().should.be.equal(55).and.be.a.Number();
      });
  });
  describe('getHysteresis()',function(){
      it('should return value of hysteresis atribute', function(){
        termostat.getHysteresis().should.be.equal(1).and.be.a.Number();
	termostat.hysteresis = 33;
        termostat.getHysteresis().should.be.equal(33).and.be.a.Number();
      });
  });
  describe('getHumidity()',function(){
      it('should return value of humidity atribute', function(){
        termostat.getHumidity().should.be.equal(100).and.be.a.Number();
	termostat.humidity = 3;
        termostat.getHumidity().should.be.equal(3).and.be.a.Number();
      });
  });
  describe('getManualSwitchPin()',function(){
      it('should return value of manualSwitchPin atribute', function(){
        termostat.getManualSwitchPin().should.be.equal(13).and.be.a.Number();
	termostat.manualSwitchPin = 55
        termostat.getManualSwitchPin().should.be.equal(55).and.be.a.Number();
      });
  });
  describe('getTermostatSwitchPin()',function(){
      it('should return value of termostatSwitchPin atribute', function(){
        termostat.getTermostatSwitchPin().should.be.equal(11).and.be.a.Number();
	termostat.termostatSwitchPin = 32
        termostat.getTermostatSwitchPin().should.be.equal(32).and.be.a.Number();
      });
  });
  describe('these get methods read real values from pins and not atribute values', function(){
    test_pin_manual = 11;
    test_pin_termostat = 13;
    beforeEach(function(done){
      gpio.open(test_pin_manual, 'out', function(){ 
        gpio.open(test_pin_termostat, 'out', function(){
          termostat.manualSwitchPin = test_pin_manual;
          termostat.termostatSwitchPin = test_pin_termostat;
	  gpio.write(test_pin_manual, 1, function(){
	    gpio.write(test_pin_termostat, 1, function(){
	      done();
	    });
	  });
	});
      });
    });
    afterEach(function(done){
      gpio.close(test_pin_manual, function(){
        gpio.close(test_pin_termostat, done);
      });
    });
    describe('getManualSwitch()',function(done){
      it('should return true if pin set Off = is the led Off?(yes)', function(done){
        gpio.write(test_pin_manual,0, function(){
	  termostat.getManualSwitch()
	  .then(function(out){
	    out.should.be.true();
	    done();
	  })
	  .done(null,done);
	});
      });
      it('should return false if pin set On = is the led Off?(no)', function(done){
        gpio.write(test_pin_manual, 1, function(){
	  termostat.getManualSwitch()
	  .then(function(out){
	    out.should.be.false();
	    done();
	  })
	  .done(null, done);
	});
      });
    });
    describe('getTermostatSwitch()',function(done){
      it('should return true if pin set Off = is the led Off?(yes)', function(done){
        gpio.write(test_pin_termostat,0, function(){
	  termostat.getTermostatSwitch()
	  .then(function(out){
	    out.should.be.true();
	    done();
	  })
	  .done(null,done);
	});
      });
      it('should return false if pin set On = is the led Off?(no)', function(done){
        gpio.write(test_pin_termostat, 1, function(){
	  termostat.getTermostatSwitch()
	  .then(function(out){
	    out.should.be.false();
	    done();
	  })
	  .done(null, done);
	});
      });
    });
  });
  describe('getManualSwitchValue', function(){
    it('should return value of manualSwitch atribute', function(){
      termostat.getManualSwitchValue().should.be.false();
      termostat.manualSwitch = true;
      termostat.getManualSwitchValue().should.be.true();
    });
  });
  describe('getTermostatSwitchValue', function(){
    it('should return value of  termostatSwitch atribute', function(){
      termostat.getTermostatSwitchValue().should.be.false();
      termostat.termostatSwitch = true;
      termostat.getTermostatSwitchValue().should.be.true();
    });
  });
  describe('getTermostatId', function(){
    it('should return value of _id atribute', function(){
      termostat.getTermostatId().should.be.equal(123123123);
      termostat._id = 55;
      termostat.getTermostatId().should.be.equal(55);
    });
  });
});
