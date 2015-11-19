var sleep = require('sleep');
var min = 22.0;
var max = 25.0;
var temp = min;
var step = 0.1;
var operation = '+';

function simulate(temp, operation){
  if(operation === '-') temp -= step;
  else if(operation === '+') temp += step;
  return Number(temp.toFixed(2));
}

function iterate(){
  while(1){
    if(temp > max) operation = '-';
    else if(temp < min) operation = '+';
    temp = simulate(temp,operation);
    console.log(temp + ',' + step);
    sleep.sleep(2);
  }
}

iterate();
