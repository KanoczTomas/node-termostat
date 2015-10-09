module.exports = ['$scope', function($scope) {
  $scope.panels = [];

  $scope.panels.push({
    "title": "Mode",
    "titleRight": "Manual|Auto",
    "body": "State",
    "bodyRight": "button",
    "button": '',
    "buttonRight": ["On", "Off"]
  });

  $scope.panels.push({
    "title": "Temperature | -> Actual Temperature",
    "body": "Temperature set xx.xxC"
  });

  $scope.panels.push({
    "title": "Humidity",
    "body": "xx.xx%"
  });

  $scope.panels.push({
    "title": "Hysteresis",
    "body": "xx.xxC"
  });
}];

