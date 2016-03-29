/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.controller("toolbarController", function ($scope, $mdDialog, $rootScope, $mdSidenav, peer) {
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

	tool.voiceCall = function () {
		$rootScope.toast("Feature awaiting build.");
	};
	tool.videoCall = function () {
		$rootScope.toast("Feature awaiting build.");
	};
	tool.sendFile = function (files) {
		console.log(files);
		if ($rootScope.targetID && $rootScope.targetID.length && peer.open && !peer.disconnected) {
			var conn = peer.connections[$rootScope.targetID][0];
			while(files.length){
				var file = files.slice(-1);
				var f = files.pop();
				var msgObj = {id: $rootScope.peerID, message: "File sent: "+f.name+" | Size: "+f.size, data:file, time: new Date().getTime(), type:"file"};
				conn.send(msgObj);
			}
		}
		else {
			if (!peer.open) {
				$rootScope.toast("Peer connection failed. Retrying.");
				peer.reconnect();
			}
		}
	};

});
