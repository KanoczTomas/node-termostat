module.exports = function($stateProvider, $urlRouterProvider) { 
    $urlRouterProvider.otherwise("/main");

    $stateProvider
        .state("main", {
            url: "/main",
            templateUrl: "/templates/main.html",
	    controller: require('./controllers/MainController')
        })
        .state("about", {
            url: "/about",
            template: "about place holder",
        })
        .state("login", {
            url: "/login",
            template: "login place holder",
        });
};
