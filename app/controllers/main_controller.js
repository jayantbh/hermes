/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.controller("mainController", function ($scope, $http, $mdToast, $timeout, $mdDialog, $rootScope, peer, $mdSidenav, $mdToast, $interval) {
	var main = this;
	$rootScope.peerStatus = "loading...";
	main.messages = [];
	main.duplicateID = false;
	var conn;
	var interval;

	function connectToTarget(){
		if(!conn || !peer.disconnected){
			conn = peer.connect($rootScope.targetID);
			conn.on('open', function () {
				$rootScope.toast('Connected to ' + $rootScope.targetID);
				if(interval){
					$interval.cancel(interval);
				}
			});
			conn.on('error', function (err) {
				console.error(err);
				$rootScope.toast(err.message);
			});
		}
		else{
			peer.reconnect();
		}
	}

	if (localStorage.targetID) {
		$rootScope.targetID = localStorage.targetID;
		connectToTarget();
		interval = $interval(connectToTarget,5000);
	}

	$rootScope.setTargetID = function () {
		$timeout(function () {
			if ($rootScope.targetID == $rootScope.peerID) {
				$rootScope.toast("You can't set the target ID to your own.");
				delete localStorage.targetID;
				$rootScope.targetID = undefined;
			}
			else if($rootScope.targetID && $rootScope.targetID.length){
				localStorage.targetID = $rootScope.targetID;
				$rootScope.toast('Target ID set to ' + $rootScope.targetID);
				$rootScope.toggleSidenav();

				connectToTarget();
			}
		});
	};
	main.send = function () {
		if(conn){
			console.log(conn);
			if(!conn.open){
				connectToTarget();
				$rootScope.toast("Connection isn't open. Trying to reconnect.");
			}
			else if ($rootScope.targetID && $rootScope.targetID.length && main.message && main.message.trim().length) {
				var msgObj = {id: $rootScope.peerID, message: main.message, time: new Date().getTime(), type:"message"};
				conn.send(msgObj);
				$timeout(function () {
					main.messages.push(msgObj);
					main.message = "";
				});
			}
		}
		else{
			$rootScope.toast("Connection not established. Partner may be offline. Trying to reconnect.");
			interval = $interval(connectToTarget,5000);
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
		console.log('My peer ID is: ' + id,peer);
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
		console.log(err);
		if (err.type == "unavailable-id") {
			isScrewed = true;
			$rootScope.peerStatus = "Please refresh.";
			$rootScope.toast(err.message, $rootScope.reset(), "Reset Hermes");
		}
		else if(err.type == "peer-unavailable"){
			$rootScope.toast(err.message, function () {
				$timeout(function () {
					$rootScope.targetID = "";
					delete localStorage.targetID;
					if(interval){
						$interval.cancel(interval);
					}
				});
			}, "CLEAR TARGET");
		}
		else if (!isScrewed) {
			$rootScope.toast(err.message);
		}
	});
	peer.on('connection', function (conn) {
		var who = (conn.peer == $rootScope.targetID)?"Your partner":"Someone";
		$rootScope.toast(who+" connected to your peer.");
		console.log(conn);
		conn.on('data', function (data) {
			var who = (data.id == $rootScope.targetID)?"Your partner":"Someone";
			console.log(main.messages);
			$timeout(function () {
				main.messages.push(data);
				if(document.visibilityState != "visible"){
					$rootScope.notify(data.message,who);
				}
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
	peer.on('close', function (data) {
		console.log(data);
	});
	peer.on('disconnected', function (data) {
		console.log(data);
	});
});
