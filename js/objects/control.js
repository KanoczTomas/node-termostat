module.exports = function(object){
  if(!object.auto) return;
  var high = object.termostat + object.hysteresis/2;
  var low = object.termostat - object.hysteresis/2;
  var temp = object.getTemperature();
  var treshold = object.getTermostat();
  console.log('inside control');
  if(temp <= high && temp >= low){
    if((treshold - temp > 0) && (object.flipable === -1)){
      object.flipable = 0;
      object.setTermostatSwitch(false);
    }
    else if((treshold - temp < 0) && (flipable === 1)){
      object.flipable = 0;
      object.setTermostatSwitch(true);
    }
  }
  else if(temp > high){
    object.flipable = 1;
    object.setTermostatSwitch(false);
  }
  else if(temp < low){
    object.flipable = -1;
    object.setTermostatSwitch(true);
  }
};
