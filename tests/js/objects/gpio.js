var gpio = require('../../../js/objects/gpio');
var piGpio = require('pi-gpio');
var should = require('should');
should.prototype = new require('should-promised');
var Promise = require('bluebird');
var mute = require('mute');

describe('gpio tests', function(){
  test_pin = 13;
  before(function(done){
    piGpio.getDirection(test_pin, function(err, out){
      if(err) done();
      else {
        piGpio.close(test_pin);
	done();
      }
    });
  });
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
      .then(function(err){
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
    it('should really write true (remember by defalt we are inversed) to the pin when resolved', function(done){
      gpio.write(test_pin, true).should.be.fulfilled()
      .then(function(){
         piGpio.read(test_pin, function(err,out){
	   should.not.exist(err);
	   out.should.be.equal(0);
	   done();
	 });
      }).done(null, done);
    });
    it('should really write false (remember by default we are inversed) to the pin when resolved', function(done){
      gpio.write(test_pin, false).should.be.fulfilled()
      .then(function(){
         piGpio.read(test_pin, function(err,out){
	   should.not.exist(err);
	   out.should.be.equal(1);
	   done();
	 });
      }).done(null, done);
    });
    it('should write true correctly when inversed flag unset', function(done){
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
    it('should write false correctly when inversed flag unset', function(done){
      gpio.inverse = false;
      gpio.write(test_pin, false).should.be.fulfilled()
      .then(function(){
        piGpio.read(test_pin, function(err,out){
	  should.not.exist(err);
	  out.should.be.equal(0);
	  done();
          gpio.inverse = true;
	});
      })
      .done(null, done);
    });
    it('should be rejected and throw Error when unsuccessful', function(done){
      gpio.write(11, true).should.be.rejected()
      .then(function(err){
        should.exist(err);
	err.should.be.Error();
	done();
      })
      .done(null, done);
    });
  });

  describe('#read()', function(){
    it('should really read the pin set to 0 as true when resolved (by default we are inversed)', function(done){
      piGpio.write(test_pin, 0, function(err){
        should.not.exist(err);
        gpio.read(test_pin).should.be.fulfilled()
        .then(function(out){
	  out.should.be.equal(true);
	  done();
        })
        .done(null, done);
      });
    });
    it('should really read the pin set to 1 as false when resolved (by default we are inversed)', function(done){
      piGpio.write(test_pin, 1, function(err){
        should.not.exist(err);
        gpio.read(test_pin).should.be.fulfilled()
        .then(function(out){
	  out.should.be.equal(false);
	  done();
        })
        .done(null, done);
      });
    });

    it('should really read the pin set to 1 as true when inverse logic flag is off', function(done){
      gpio.inverse = false;
      piGpio.write(test_pin, 1, function(err){
        should.not.exist(err);
	gpio.read(test_pin).should.be.fulfilled()
	.then(function(out){
	  should.exist(out)
	  out.should.equal(true);
	  gpio.inverse = true;
	  done();
	})
	.done(null, done);
      });
    });
    it('should really read the pin set to 0 as false when inverse logic flag is off', function(done){
      gpio.inverse = false;
      piGpio.write(test_pin, 0, function(err){
        should.not.exist(err);
	gpio.read(test_pin).should.be.fulfilled()
	.then(function(out){
	  should.exist(out)
	  out.should.equal(false);
	  gpio.inverse = true;
	  done();
	})
	.done(null, done);
      });
    });
    it('should throw an error when unable to read and be rejected', function(done){
      gpio.read(11).should.be.rejected()
      .then(function(err){
        should.exist(err);
	err.should.be.Error();
	done();
      })
      .done(null, done);
    });
  });

  describe('#close()', function(){
    it('should really close the pin when resolved', function(done){
      var tmp = process.stderr.write;
      process.stderr.write = function(){};
      gpio.close(test_pin).should.be.fulfilled()
      .then(function(){
	piGpio.read(test_pin, function(err){
	  should.exist(err);
	  err.should.be.an.Error();
	  done();
	  process.stderr.write = tmp;
	});
      })
      .done(null, done);
    });
    it('should return error if can not close pin and be rejected', function(done){
      var tmp = process.stderr.write;
      process.stderr.write = function(){};
      gpio.close(test_pin).should.be.rejected()
      .then(function(err){
        should.exist(err);
	err.should.be.an.Error();
	done();
	process.stderr.write = tmp;
      })
      .done(null, done);
    });
  });
});
