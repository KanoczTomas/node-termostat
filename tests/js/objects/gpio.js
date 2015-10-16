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
      gpio.init(test_pin).should.be.rejected()
      .done(null, done);

      gpio.init(test_pin)
      .catch(function(err){
        should.exist(err);
	err.should.be.an.Array();
	err[0].should.be.an.Error();
	err[1].should.be.a.Number().and.be.equal(test_pin);
	process.stderr.write = tmp;
	done();
      })
      .done(null, done);
    });
  });

  describe('#write()', function(){
    it('should really write to the pin when resolved', function(done){
      gpio.write(test_pin, true).should.be.fulfilled()
      .then(function(){
         piGpio.read(test_pin, function(err,out){
	   should.not.exist(err);
	   out.should.be.equal(0);
	   done();
	 });
      }).done(null, done);
    });
    it('inverse logic should work', function(done){
      gpio.inverse = false;
      gpio.write(test_pin, true).should.be.fulfilled()
      .then(function(){
        piGpio.read(test_pin, function(err,out){
	  should.not.exist(err);
	  out.should.be.equal(1);
	  done();
          gpio.inverse = true;
	});
      })
      .done(null, done);
    });
    it('should be rejected and throw Error when unsuccessful', function(done){
      gpio.write(11, true).should.be.rejected()
      .done(null, done);

      gpio.write(11, true)
      .catch(function(err){
        should.exist(err);
	err.should.be.Error();
	done();
      })
      .done(null, done);
    });
  });

  describe('#read()', function(){
    it('should really read the pin when resolved');
    it('inverse logic should work');
    it('should throw an error when unable to read and be rejected');
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
