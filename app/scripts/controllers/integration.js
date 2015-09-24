
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
 * @name sparkyApp.controller:IntegrationCtrl
 * @description
 * # IntegrationCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('IntegrationCtrl', function ($scope, $modal, $log) {

  $scope.open = function (site) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      //size: size,
      resolve: {
        site: function () {
          return site;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  });


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('sparkyApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, site) {

  $scope.site = site;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});