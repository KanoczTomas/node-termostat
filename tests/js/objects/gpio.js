var gpio = require('../../../js/objects/gpio');
var piGpio = require('pi-gpio');
var should = require('should');
should.prototype = new require('should-promised');
var Promise = require('bluebird');
var mute = require('mute');

describe('gpio tests', function(){
  test_pin = 13;
  describe('#init()', function(){
    beforeEach('we do some preparation before testing #init()',function(done){
      piGpio.getDirection(test_pin, function(err, out){
        if(err) done();
        else{
	  piGpio.close(test_pin,function(){
	    done();
	  });
        }
      });
    });
    it('should return a promise', function(){
      return gpio.init(test_pin).should.be.a.Promise();
    });
    it('should really open the pin when resolved', function(done){
      gpio.init(test_pin)
      .then(function(){
        piGpio.write(test_pin, 0, function(err){
	  should.not.exist(err);
	  done(err);
        })
      }).should.be.fulfilled()
      .done(null,done);
    });
    it('should return an Array [err,pin] upon failure', function(done){
      piGpio.open(test_pin, 'out', function(err){
        should.not.exist(err);
	gpio.init(test_pin).should.be.rejected()
	.then(function(){
	  done();
	})
	.error(function(err){
	  err.should.be.an.Array();
	  err[0].should.be.an.Error();
	  err[1].should.be.equal(test_pin).and.be.a.Number();
	  done();
	})
	.done(null,done);
      });
    });
  });

  describe('#close()', function(){
    test_pin = 13;
    beforeEach('we do some preparation before testing #close()',function(done){
      piGpio.getDirection(test_pin, function(err){
        if(err) piGpio.open(test_pin, 'out', done);
	else done();
      });
    });
    it('should return a promise', function(){
      return gpio.close(test_pin).should.be.a.Promise();
    });
    
  });
});
