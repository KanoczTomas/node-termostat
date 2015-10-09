var angular = require('angular');
var config = require('./config');
var cssify = require('cssify');
var jquery = require('jquery');
//var bootstrap = require('bootstrap');
cssify.byUrl('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');

var uiRouter = require('angular-ui-router');
var app = angular.module('test',[
  uiRouter
]);
app.config(require('./route'));

//require('./controllers');

