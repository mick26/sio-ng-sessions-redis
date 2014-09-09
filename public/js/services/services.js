'use strict';


/*======================================================
Module - for services
======================================================*/
angular.module('myApp.services', [])

//.factory('socket', function (socketFactory, $rootScope, $window, $q, $timeout, CONFIG) {
//    function SocketFactory($q, $rootScope, socketFactory, $timeout, config) {


/*
 * Make the socket instance
 */
.factory('socket', function (socketFactory) {
    return socketFactory();
})