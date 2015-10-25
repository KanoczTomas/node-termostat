var helpers = require('../../../js/utilities/helpers');
var should = require('should');

describe('Utility functions:', function(){

  describe('#variableChangeHelper()', function(){
    it('should return true when there is a change in values', function(){
      helpers.variableChangeHelper(5, 3).should.be.true(); 
    });
    it('should return false when there is no change in values', function(){
      helpers.variableChangeHelper(5, 5).should.be.false(); 
    });
  });

});
