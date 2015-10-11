var Termostat = require('../../../js/objects/termostat');
var should = require('should');

termostat = new Termostat();
describe('termostat tests', function(){
  describe('getTemperature', function(){
    it('should return temperature and be a Number', function(){
      termostat.temperature = 44;
      termostat.getTemperature().should.be.exactly(44).and.be.a.Number();

      termostat.temperature = 54;
      termostat.getTemperature().should.be.exactly(54).and.be.a.Number();

      termostat.temperature = 4;
      termostat.getTemperature().should.be.exactly(4).and.be.a.Number();
    });
  });
});
