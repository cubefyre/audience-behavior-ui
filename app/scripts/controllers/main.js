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
 * @name sparkyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('MainCtrl', function ($scope, $rootScope, $cookieStore, $modal, $http) {
  /*
  $rootScope.userEmail = $cookieStore.get("userEmail");
	console.log($rootScope.userEmail);
  
  $scope.init = function(){
    if(typeof $rootScope.userEmail === 'undefined'){
      console.log("launch modal");
      var modalInstance = $modal.open({
        templateUrl: 'views/misc/email-modal.html',
        controller: function($scope, $modalInstance) {
          $scope.saveEmail = function() {
              if($scope.userEmail != null){
                $rootScope.userEmail = $scope.userEmail;
                $cookieStore.put("userEmail", $rootScope.userEmail);
                sendMail();
                $modalInstance.close($scope.userEmail);
              }
          };
          $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
          };
        },
        animation: false,
        backdrop: 'static'
      });   
    }
  };

  function sendMail(){
    var mailJSON ={
        "key": "gL_CcdfN5KQIxqh_fG25lg",
        "message": {
          "html": $scope.userEmail,
          "text": $scope.userEmail,
          "subject": "Demo Request from " + $scope.userEmail,
          "from_email": "info@sparklinedata.com",
          "from_name": "Sparkline Beta Demo User",
          "to": [
            {
              "email": "jitender@sparklinedata.com",
              "name": "Jitender",
              "type": "to"
            }
          ],
          "important": false,
          "track_opens": null,
          "track_clicks": null,
          "auto_text": null,
          "auto_html": null,
          "inline_css": null,
          "url_strip_qs": null,
          "preserve_recipients": null,
          "view_content_link": null,
          "tracking_domain": null,
          "signing_domain": null,
          "return_path_domain": null
        },
        "async": false,
        "ip_pool": "Main Pool"
    };
    var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
    $http.post(apiURL, mailJSON).
      success(function(data, status, headers, config) {
        alert('successful email send.');
        $scope.form={};
        console.log('successful email send.');
        console.log('status: ' + status);
        console.log('data: ' + data);
        console.log('headers: ' + headers);
        console.log('config: ' + config);
      }).error(function(data, status, headers, config) {
        console.log('error sending email.');
        console.log('status: ' + status);
      });
  }*/


  /*console.log($rootScope.isUserLoggedIn);
	$scope.showSidebar = function(){
		if(typeof $window.sessionStorage.token === 'undefined'){
	  		console.log($window.sessionStorage.token);
	  		console.log($rootScope.isUserLoggedIn);
	  		return false;
	  	} else {
	  		return true;
	  	}
    };  

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/login');
    }

    if(value) {
      console.log("Connect");
      //Do something when the user is connected
    }

  }, true);  
  */  	
  });
