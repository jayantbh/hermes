/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.controller("mainController", function ($scope, $http, $mdToast, $timeout, $mdDialog, $rootScope, peer, $mdSidenav, $mdToast) {
	var main = this;
	$rootScope.peerStatus = "loading...";
	main.messages = [];
	main.duplicateID = false;

	if (localStorage.targetID) {
		$rootScope.targetID = localStorage.targetID;
	}

	$rootScope.setTargetID = function () {
		$timeout(function () {
			if ($rootScope.targetID == $rootScope.peerID) {
				$rootScope.toast("You can't set the target ID to your own.");
				delete localStorage.targetID;
				$rootScope.targetID = undefined;
			}
			else {
				localStorage.targetID = $rootScope.targetID;
				$rootScope.toast('Target ID set to ' + $rootScope.targetID);
				$rootScope.toggleSidenav();
			}
		});
	};
	main.send = function () {
		if ($rootScope.targetID && $rootScope.targetID.length) {
			var conn = peer.connect($rootScope.targetID);
			conn.on('open', function () {
				var msgObj = {id: $rootScope.peerID, message: main.message, time: new Date().getTime()};
				conn.send(msgObj);
				$timeout(function () {
					main.messages.push(msgObj);
					main.message = "";
				});
			});
			conn.on('error', function (err) {
				console.error(err);
				$rootScope.toast(err.message);
			});
		}
	};
	function call() {
		navigator.getUserMedia({video: true, audio: true}, function (stream) {
			var call = peer.call($rootScope.targetID, stream);
			call.on('stream', function (remoteStream) {
				// Show stream in some <video> element.
				console.log(remoteStream);
			});
		}, function (err) {
			console.log('Failed to get local stream', err);
		});
	}

	peer.on('open', function (id) {
		console.log('My peer ID is: ' + id);
		$timeout(function () {
			localStorage.peerID = $rootScope.peerID = id;
			$rootScope.toast("Connected to WebRTC.");
			if ($rootScope.targetID) {
				if ($rootScope.targetID == $rootScope.peerID) {
					delete localStorage.targetID;
					$rootScope.targetID = undefined;
				}
			}
		});
	});

	var isScrewed = false;
	peer.on('error', function (err) {
		if(err.type == "unavailable-id"){
			isScrewed = true;
			$rootScope.toast(err.message, function () {
				delete localStorage.peerID;
				window.location.href = "/";
			}, "Reset Hermes");
		}
		else if(!isScrewed){
			console.log(err);
			$rootScope.toast(err.message);
		}
	});
	peer.on('connection', function (conn) {
		console.log(conn);
		conn.on('data', function (data) {
			console.log(main.messages);
			$timeout(function () {
				main.messages.push(data);
			});
		});
		conn.on('call', function (call) {
			console.log(call);
			navigator.getUserMedia({video: true, audio: true}, function (stream) {
				call.answer(stream); // Answer the call with an A/V stream.
				call.on('stream', function (remoteStream) {
					// Show stream in some <video> element.
					console.log(remoteStream);
				});
			}, function (err) {
				console.log('Failed to get local stream', err);
			});
		});
	});
});
