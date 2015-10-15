var gpio = require('../../../js/objects/gpio');
var piGpio = require('pi-gpio');
var should = require('should');
should.prototype = new require('should-promised');
var Promise = require('bluebird');
var mute = require('mute');

describe('gpio tests', function(){
  test_pin = 13;
  describe('#init()', function(){
    it('should really open the pin when resolved', function(done){
      gpio.init(test_pin).should.be.a.Promise().and.be.fulfilled()
      .then(function(){
        piGpio.write(test_pin, 1, done);
      })
      .error(function(err){
        should.not.exist(err);
	done();
      })
      .done(null, done);
    });
    it('should return an Array [err,pin] upon failure', function(done){
      var tmp = process.stderr.write;
      process.stderr.write = function(){};//the pi-gpio library is talking too much, silencing it
      gpio.init(test_pin)
      .then(function(){
        var tmp = 'this should never be executed';
	should.not.exist(tmp);
	done();
      })
      .error(function(err){
        should.exist(err);
	err.should.be.an.Array();
	err[0].should.be.an.Error();
	err[1].should.be.a.Number();
	process.stderr.write = tmp;
	done();
      })
      .done(null, done);
    });
  });

  describe('#close()', function(){
    test_pin = 13;
    it('should really close the pin when resolved');//, function(done){
    //});
    it('should return error if can not close pin and be rejected');//, function(done){
    //});
  });
  after(function(){
    piGpio.close(test_pin);
  });
});
