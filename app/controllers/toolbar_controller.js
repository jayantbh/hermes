/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.controller("toolbarController", function ($scope, $mdDialog, $rootScope, $mdSidenav) {
	var tool = this;

	tool.help = function (e) {
		$mdDialog.show({
			controller: "dialogController",
			controllerAs: "dialog",
			templateUrl: "views/components/help_dialog.html",
			parent: angular.element(document.body),
			targetEvent: e,
			clickOutsideToClose: true
		});
	};

});
