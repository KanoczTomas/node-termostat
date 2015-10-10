module.exports = [ '$scope', '$http', '$interval',  function($scope, $http, $interval){

  $scope.output = {};
  function helper(url){
    $http.get('/api/' + url)
    .success(function(res){
      $scope.output[url] = res;
    });
  }
  function refresh(what){
    if(what === undefined){
      $http.get('/api/state')
      .success(function(res){
        $scope.output = res;
      });
    }
    else{
      //helper('mode');
      helper('temperature');
      //helper('termostat');
      //helper('hysteresis');
      helper('humidity');
      //helper('manualSwitch');
      //helper('termostatSwitch');
    }
  }
  
  refresh();
  $interval(function(){
    refresh('temperature');
    refresh('humidity');
  },2000);

  $scope.cssHelper = function (input, varToCheck, cssClass){ //checks input to the internal state, if the same will return the css to aply on element
    if(cssClass === undefined) cssClass = 'active|' //cssClass is the | delimited string of class if comparison true, and if false
    if(input === $scope.output[varToCheck]) return cssClass.split("|")[0];
    return cssClass.split("|")[1];
  };

  $scope.setHelper = function(input, varToSet){ //sets the state variable
    $scope.output[varToSet] = input;
    $http.post('/api/' + varToSet + '/' + String(input))
    .success(function(){
      refresh(varToSet);
    });
  };
  
  $scope.changeValueHelper = function (varToModify, operation, byHowMuch){
    if(byHowMuch === undefined) byHowMuch = 0.5;
    if(operation === '+') $scope.output[varToModify] += byHowMuch;
    else if(operation === '-') $scope.output[varToModify] -= byHowMuch;
    else $scope.output.error = "Error changing +" + varToModify;
    $scope.setHelper($scope.output[varToModify], varToModify);
  };

  $scope.translateTrueFalseHelper = function (varToTranslate,toWhat){
    var ifTrue = toWhat.split("|")[0];//to what is a | delimited string
    var ifFalse = toWhat.split("|")[1];
    if($scope.output[varToTranslate]) return ifTrue;
    return ifFalse;
  }

}];
