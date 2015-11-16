var helpers = require('../../../js/utilities/helpers');
var TermostatModel = require('../../../js/models/termostat');
var should = require('should');
should.prototype = new require('should-promised');
var mongoose = require('mongoose');
var Termostat = require('../../../js/objects/termostat');

termostat = new Termostat();

describe('Utility functions:', function(){

  describe('#variableChangeHelper()', function(){
    it('should return true when there is a change in values', function(){
      helpers.variableChangeHelper(5, 3).should.be.true(); 
    });
    it('should return false when there is no change in values', function(){
      helpers.variableChangeHelper(5, 5).should.be.false(); 
    });
  });

  describe('#mongodbWriteHelper()', function (){
    before(function(){
      mongoose.connect('mongodb://localhost/test-termostat');
    });
    it('should be rejected and return error when object._id is not found', function(done){
      helpers.mongodbWriteHelper({test: 'jahoda'}, 'test').should.be.rejected()
      .then(function(err){
        should.exist(err);
	err.should.be.an.Error();
	done();
      })
      .done(null, done);
    });
    it('should write the db without errors', function(done){
      toWrite = new TermostatModel({
        auto: true
      });
      toWrite.save(function(err){
        should.not.exist(err);
	done();
      });
    });
    it('should write the database correctly', function(done){
      TermostatModel.find({}, function(err, out){
        should.not.exist(err);
	out.length.should.be.equal(1);
	termostat._id = out._id;
	out.auto.should.be.true();
	done();
      });
    });
    it('should write always to the same database', function(done){
      termostat.auto = false;
      helpers.mongodbWriteHelper(termostat, 'auto').should.be.fulfilled()
      .then(function(){
        TermostatModel.find({}, function(err, out){
          out.length.should.be.equal(1);
          out.auto.should.be.false();
          done();
        })
      })
      .done(done);
      after(function(){
        console.log('todo');
        //TermostatModel.remove();
        //mongoose.connection.db.dropDatabase();
      });
    });
  });
});
