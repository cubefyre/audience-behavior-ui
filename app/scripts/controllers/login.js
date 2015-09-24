/* 
* # Author - Jitender Aswani
* # May 2015
* # Audience Behavior REST APP
* # SparklineData, Inc. -- http://www.sparklinedata.com/
* # Copyright 2014-2015 SparklineData, Inc
* #
* # Licensed under the Apache License, Version 2.0 (the "License");
* # you may not use this file except in compliance with the License.
* # You may obtain a copy of the License at
* #
* # http://www.apache.org/licenses/LICENSE-2.0
* #
* # Unless required by applicable law or agreed to in writing, software
* # distributed under the License is distributed on an "AS IS" BASIS,
* # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* # See the License for the specific language governing permissions and
* # limitations under the License.
*/

'use strict';

/**
 * @ngdoc function
 * @name sparkyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('LoginCtrl', function ($route, $rootScope, $scope, $http, $location, $window, AUTH_EVENTS, UserService) {
	var action = $route.current.action;
	if (action === "signout"){
		delete $window.sessionStorage.token;
        delete $window.sessionStorage.user_email;
        $rootScope.isUserLoggedIn = false;
	}

	$scope.user = {};
	$scope.sign_in_btn_text = "Sign In";

	$scope.signDeveloperIn = function(user) {
	  //$scope.$broadcast('show-errors-check-validity');
	  if ($scope.signinForm.$invalid) { 
	    $scope.messages = "";
	    return;
	  }
	  console.log(user);
	  $scope.sign_in_btn_text  = 'Signing In...';
	  $scope.sign_in_btn_disabled = true;
	
	/*$http({
	    method  : 'GET',
	    url     : serverSettings.url.user.signin,
	    params: {email: $scope.user.email},
	  })
	  .success(function(data, status, headers, config) {
	    console.log(data);
	    if (data.error) {
	      // if not successful, bind errors to error variables
	      //  $scope.errorName = data.errors.name;
	       // $scope.errorSuperhero = data.errors.superheroAlias;
	      $scope.message = data.message;

	    } else {
	        //if successful, redirect the browser to testdrive
	        //$scope.message = data.message;
	        // Store the token
	        $window.sessionStorage.token = data.token;
	        $window.sessionStorage.user_email = $scope.user.email;
	        $rootScope.isUserLoggedIn = true;
	        //$window.location.href=( "#options" );
	        $location.path( "/dashboard" );
	    }
	  })
	  .error(function (data, status, headers, config) {
	    // Erase the token if the user fails to log in
	    // delete $window.sessionStorage.token;
	    // Handle login errors here
	  	$scope.sign_in_btn_disabled = false;
	    $scope.message = 'Error: Invalid user or password. Please try again.';
	  	$scope.sign_in_btn_text  = 'Get Started';

	});	*/
	UserService.signIn(user)
	.then(
      	function (response) {
      		$scope.sign_in_btn_text  = 'Get Started';
  			$scope.sign_in_btn_disabled = false;
      		console.log(response);
			if (response.data.error) {
		      // if not successful, bind errors to error variables
		      $scope.message = data.message;
		    } else {
		    	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		        //if successful, redirect the browser to testdrive
		        // Store the token
		        $window.sessionStorage.token = response.token;
		        $window.sessionStorage.userEmail = user.email;
		        //$window.location.href=( "#options" );
		        $location.path("/");
		    }						              
     	 },
    	function (httpError) {
    		$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		  	$scope.sign_in_btn_disabled = false;
		    $scope.message = 'Error: Invalid user or password. Please try again.';
		  	$scope.sign_in_btn_text  = 'Get Started';
	    	console.log(httpError)
			//throw httpError.status + " : " + httpError.data;
 	});		
	/*
	  promise.then(
		function(payload) {
			console.log(data);
			if (data.error) {
		      // if not successful, bind errors to error variables
		      //  $scope.errorName = data.errors.name;
		      // $scope.errorSuperhero = data.errors.superheroAlias;
		      $scope.message = data.message;

		    } else {
		        //if successful, redirect the browser to testdrive
		        //$scope.message = data.message;
		        // Store the token
		        $window.sessionStorage.token = data.token;
		        $window.sessionStorage.developer_email = $scope.user.email;
		        //$window.location.href=( "#options" );
		        $location.path( "/" );
		});*/
	};

  });
