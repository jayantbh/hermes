/**
 * Created by Jayant Bhawal on 22-03-2016.
 */
hermes.controller("dialogController", function ($scope, $mdDialog, $rootScope, $timeout) {
	var dialog = this;

	dialog.hide = function () {
		$mdDialog.hide();
	};
	dialog.cancel = function () {
		$mdDialog.cancel();
	};
	dialog.answer = function (answer) {
		$mdDialog.hide(answer);
	};

});
