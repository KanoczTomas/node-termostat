var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('TermostatModel', new Schema({
  auto: Boolean,
  termostat: Number,
  hysteresis: Number,
  manualSwitch: Boolean,
  manualSwitchPin: Number,
  termostatSwitch: Boolean,
  termostatSwitchPin: Number
}));
