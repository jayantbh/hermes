/**
 * Created by Jayant Bhawal on 20-03-2016.
 */

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
localStorage = window.localStorage;

function peerInit() {
	if (localStorage.peerID) {
		return new Peer(localStorage.peerID, {key: 'h1iuagg92ievcxr'});
	}
	else {
		return new Peer({key: 'h1iuagg92ievcxr'});
	}
}
hermes
	.value('peer', peerInit())
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
		$rootScope.toast = function (text,callback,actionText) {
			$mdToast.show(
				$mdToast.simple()
					.textContent(text)
					.position("top right")
					.action(actionText || "OK")
					.hideDelay(2000)
			).then(function (response) {
					if (response == 'ok') {
						if(callback){
							callback();
						}
						$mdToast.hide();
					}
				});
		};
		$rootScope.copySuccess = function () {
			$rootScope.toast('ID Copied.');
		};

		$rootScope.toggleSidenav = function () {
			$mdSidenav('left').toggle();
		}
	});
