var Termostat = require('../../../js/objects/termostat');
var should = require('should');
var gpio = require('../../../js/objects/gpio');

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

  describe('#getMode()',function(){
      it('should return value of auto atribute', function(){
        termostat.getMode().should.be.false();
	termostat.auto = true;
	termostat.getMode().should.be.true();
      });
  });
  describe('#getTemperature()',function(){
      it('should return value of temperature atribute', function(){
        termostat.getTemperature().should.be.equal(0).and.be.a.Number();
	termostat.temperature = 5;
	termostat.getTemperature().should.be.equal(5).and.be.a.Number();
      });
  });
  describe('#getTermostat()',function(){
      it('should return value of termostat atribute', function(){
        termostat.getTermostat().should.be.equal(23).and.be.a.Number();
	termostat.termostat = 55
        termostat.getTermostat().should.be.equal(55).and.be.a.Number();
      });
  });
  describe('#getHysteresis()',function(){
      it('should return value of hysteresis atribute', function(){
        termostat.getHysteresis().should.be.equal(1).and.be.a.Number();
	termostat.hysteresis = 33;
        termostat.getHysteresis().should.be.equal(33).and.be.a.Number();
      });
  });
  describe('#getHumidity()',function(){
      it('should return value of humidity atribute', function(){
        termostat.getHumidity().should.be.equal(100).and.be.a.Number();
	termostat.humidity = 3;
        termostat.getHumidity().should.be.equal(3).and.be.a.Number();
      });
  });
  describe('#getManualSwitchPin()',function(){
      it('should return value of manualSwitchPin atribute', function(){
        termostat.getManualSwitchPin().should.be.equal(13).and.be.a.Number();
	termostat.manualSwitchPin = 55
        termostat.getManualSwitchPin().should.be.equal(55).and.be.a.Number();
      });
  });
  describe('#getTermostatSwitchPin()',function(){
      it('should return value of termostatSwitchPin atribute', function(){
        termostat.getTermostatSwitchPin().should.be.equal(11).and.be.a.Number();
	termostat.termostatSwitchPin = 32
        termostat.getTermostatSwitchPin().should.be.equal(32).and.be.a.Number();
      });
  });
  describe('#getManualSwitchValue()', function(){
    it('should return value of manualSwitch atribute', function(){
      termostat.getManualSwitchValue().should.be.false();
      termostat.manualSwitch = true;
      termostat.getManualSwitchValue().should.be.true();
    });
  });
  describe('#getTermostatSwitchValue()', function(){
    it('should return value of  termostatSwitch atribute', function(){
      termostat.getTermostatSwitchValue().should.be.false();
      termostat.termostatSwitch = true;
      termostat.getTermostatSwitchValue().should.be.true();
    });
  });
  describe('#getTermostatId()', function(){
    it('should return value of _id atribute', function(){
      termostat.getTermostatId().should.be.equal(123123123);
      termostat._id = 55;
      termostat.getTermostatId().should.be.equal(55);
    });
  });
});

test_pin = 15;
describe('These functions return a promise which when resolved returns real states of pins, not object atributes', function(){
  before(function(done){
    termostat.manualSwitchPin = test_pin;
    termostat.termostatSwitchPin = test_pin;
    gpio.init(test_pin)
    .then(function(){
      done();
    });
  });
  describe('#getManualSwitch()', function(){
    it('should have termostat.manualSwitchPin set to ' + test_pin, function(done){
      termostat.getManualSwitchPin().should.be.equal(test_pin);
      done();
    });

    it('#getManualSwitch() should return true when written true', function(done){
      gpio.write(test_pin, true)
      .then(function(){
        return termostat.getManualSwitch();
      })
      .then(function(out){
        should.exist(out);
        out.should.be.true();
        done();
      })
      .done(null, done);
    });

    it('#getManualSwitch() should return false when written false', function(done){
      gpio.write(test_pin, false)
      .then(function(){
        return termostat.getManualSwitch();
      })
      .then(function(out){
        should.exist(out);
        out.should.be.false();
        done();
      })
      .done(null, done);
    });
  });

  describe('#getTermostatSwitch()', function(){
    it('should have termostat.termostatSwitchPin set to ' + test_pin, function(done){
      termostat.getTermostatSwitchPin().should.be.equal(test_pin);
      done();
    });

    it('#getTermostatSwitch() should return true when written true', function(done){
      gpio.write(test_pin, true)
      .then(function(){
        return termostat.getTermostatSwitch();
      })
      .then(function(out){
        should.exist(out);
        out.should.be.true();
        done();
      })
      .done(null, done);
    });

    it('#getTermostatSwitch() should return false when written false', function(done){
      gpio.write(test_pin, false)
      .then(function(){
        return termostat.getTermostatSwitch();
      })
      .then(function(out){
        should.exist(out);
        out.should.be.false();
        done();
      })
      .done(null, done);
    });
  });

  after(function(done){
    gpio.close(test_pin)
    .then(function(){
      done();
    });
  });
});

describe('Set methods:', function(){
  describe('#setMode()', function(){
    it('should ');
  });
  describe('#setTemperature()', function(){
    it('should ');
  });
  describe('#setTermostat()', function(){
    it('should ');
  });
  describe('#setHysteresis()', function(){
    it('should ');
  });
  describe('#setHumidity()', function(){
    it('should ');
  });
  describe('#setManualSwitch()', function(){
    it('should ');
  });
  describe('#setTermostatSwitch()', function(){
    it('should ');
  });
});
