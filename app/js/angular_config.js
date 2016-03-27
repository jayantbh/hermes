/**
 * Created by Jayant Bhawal on 20-03-2016.
 */

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function peerInit() {
	if (window.location.hostname == "localhost") {
		return new Peer({key: 'h1iuagg92ievcxr'});
	}
	else {
		return new Peer({key: 'h1iuagg92ievcxr'});
	}
}
hermes
	.constant('peer', peerInit())
	.config(function ($mdThemingProvider) {
		$mdThemingProvider
			.theme('default')
			.primaryPalette('brown', {
				'default': '800'
			})
			.accentPalette('red')
			.warnPalette('yellow')
			.backgroundPalette('grey', {
				'default': '200'
			});
		//.dark();
	})
	.run(function ($rootScope, $mdToast, $mdSidenav) {
		$rootScope.toast = function (text) {
			$mdToast.show(
				$mdToast.simple()
					.textContent(text)
					.hideDelay(3000)
			);
		};
		$rootScope.copySuccess = function () {
			$rootScope.toast('ID Copied.');
		};

		$rootScope.toggleSidenav = function () {
			$mdSidenav('left').toggle();
		}
	});
