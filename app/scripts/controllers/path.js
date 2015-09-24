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
 * @name sparkyApp.controller:PathCtrl
 * @description
 * # PathCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('PathCtrl', function ($scope) {
	
    /************************ data picker options ************************/
    $scope.dateRange = {startDate: moment().subtract(89, 'days').toDate(), endDate: moment().toDate()};
    $scope.datePickerOpts = {
        format: 'YYYY-MM-DD',
        opens:'left',
        applyClass:'btn-blue',
        ranges: {
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'Last 90 Days': [moment().subtract(89, 'days'), moment()]
        },
        startDate: $scope.dateRange.startDate,
        endDate: $scope.dateRange.endDate
    };    
    //Watch for date changes
    $scope.$watch('dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate && 
            newDateRange.endDate !== oldDateRange.endDate) {
            $scope.currentRetention.period = newDateRange;
            fetchTopPaths();
        }   
    }, false);  

    fetchTopPaths();

    function fetchTopPaths(){
        $scope.d3Data = [
          {name: "Greg", score: 98},
          {name: "Ari", score: 96},
          {name: 'Q', score: 75},
          {name: "Loser", score: 48}
        ];        
        $scope.topPaths = [
        	{'rank': 1, 
        		'steps': [{'name': 'product', 'depth': 1, 'count': 980, 'percent': 100}, 
        			{'name': 'end', 'depth':2, 'count': 80, 'percent': 15.6}]
        	},
        	{'rank': 2, 
        		'steps': [{'name': 'home', 'depth': 1, 'count': 980, 'percent': 100}, 
        			{'name': 'end', 'depth':2, 'count': 80, 'percent': 10.0}
        			]
        	},
        	{'rank': 3, 
        		'steps': [{'name': 'home', 'depth': 1, 'count': 980, 'percent': 100}, 
        			{'name': 'product', 'depth':2, 'count': 80, 'percent': 8.2},
        			{'name': 'end', 'depth':2, 'count': 20, 'percent': 5.1}
        			]
        	},
        	{'rank': 4, 
        		'steps': [{'name': 'product', 'depth': 1, 'count': 980, 'percent': 100}, 
        			{'name': 'product', 'depth':2, 'count': 80, 'percent': 8.2},
        			{'name': 'end', 'depth':2, 'count': 80, 'percent': 4.2}
        			]
        	},  
        	{'rank': 5, 
        		'steps': [{'name': 'home', 'depth': 1, 'count': 980, 'percent': 100}, 
        			{'name': 'search', 'depth':2, 'count': 80, 'percent': 8.2},
        			{'name': 'product', 'depth':2, 'count': 80, 'percent': 8.2},
        			{'name': 'end', 'depth':2, 'count': 80, 'percent': 3.6}
        			]
        	}
        	]; 
    }
        /*
        product-end	6530687	15.6%
        home-end	4177943	10.0%
        home-product-end	2138550	5.1%
        product-product-end	1748764	4.2%
        home-search-product-end	1515532	3.6%
        home-product-product-end	877057	2.1%
        home-product-product-product-product-product	862616	2.1%
        product-product-product-product-product-product	820886	2.0%
        home-search-product-product-product-product	795266	1.9%
        product-product-product-end	719556	1.7%
        */
	    	
  });
