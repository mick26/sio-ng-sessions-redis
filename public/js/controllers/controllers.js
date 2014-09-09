'use strict';

/*================================================
Controllers Module
================================================ */
angular.module('myApp.controllers', [])


.controller('MainCtrl', function ($scope, $rootScope, $http, $location, socket, $cookies, $cookieStore) {

	$cookies.mick="This is micks Cookie"; //create cookie
	$scope.sidCookie = $cookies.sid;

	//string manipulation to retrieve SessionID from sid cookie
	$scope.sessionID = $cookies.sid.split('.')[0].substring(2);

	socket.on('connect', function() {
	  console.log('connected');
	});

	socket.on('news', function (data) {
	  console.log(data);
	  $scope.news = data.key
	});

	socket.on('time', function (data) {
	  console.log(data);
	  $scope.time = data;
	});

	$scope.destroySession = function() {
		console.log("in destroySession");
		socket.emit('destroySession');
	};

})
