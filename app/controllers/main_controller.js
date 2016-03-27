/**
 * Created by Jayant Bhawal on 20-03-2016.
 */
hermes.controller("mainController", function ($scope, $http, $mdToast, $timeout, $mdDialog, $rootScope, peer, $mdSidenav) {
	var main = this;

	$scope.close = function () {
		$mdSidenav('left').close();
	};

	main.setTargetID = function () {
		$timeout(function () {
			$rootScope.toast('Target ID set to '+main.targetID);
		});
	};
	main.send = function(){
		var conn = peer.connect(main.targetID);
		conn.on('open', function(){
			conn.send(ID+' hi!');
		});
	};
	function call(){
		navigator.getUserMedia({video: true, audio: true}, function(stream) {
			var call = peer.call(main.targetID, stream);
			call.on('stream', function(remoteStream) {
				// Show stream in some <video> element.
				console.log(remoteStream);
			});
		}, function(err) {
			console.log('Failed to get local stream' ,err);
		});
	}

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		$timeout(function () {
			$rootScope.peerID = id;
		});
	});
	peer.on('connection', function(conn) {
		console.log(conn);
		conn.on('data', function(data){
			// Will print 'hi!'
			console.log(data);
			document.getElementById("incoming").innerText += "\n"+data;
		});
		conn.on('call', function(call) {
			console.log(call)
			navigator.getUserMedia({video: true, audio: true}, function(stream) {
				call.answer(stream); // Answer the call with an A/V stream.
				call.on('stream', function(remoteStream) {
					// Show stream in some <video> element.
					console.log(remoteStream);
				});
			}, function(err) {
				console.log('Failed to get local stream' ,err);
			});
		});
	});
});
