/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state('home', {
			//url: '/',
			views: {
				"root": {
					templateUrl: "views/home.html",
					controller: "mainController",
					controllerAs: "main"
				},
				"toolbar":{
					templateUrl: "views/toolbar.html",
					controller: "toolbarController",
					"controllerAs": "tool"
				}
			}
		});

});
