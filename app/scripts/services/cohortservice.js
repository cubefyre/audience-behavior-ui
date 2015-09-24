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
 * @ngdoc service
 * @name sparkyApp.CohortService
 * @description
 * # CohortService
 * Service in the sparkyApp.
 */
angular.module('sparkyApp')
  .service('CohortService', function ($http, $filter, SERVER_SETTINGS) {

  	/* 
	* used by Retention controller 
	*/
	this.getRetentionData = function(bornEvent, returnEvent, startDate, endDate, unitValue, dataAs, propFilters, onFilterIndex, chart) {
		//chart = typeof chart !== 'undefined' ? chart : true;
		//var requestURL = 'http://localhost:19980/segmentation/data';
	    // last filter in the list is always the on (group by) filter
		var ed = $filter('date')(endDate, 'yyyy-MM-dd');
		var sd = $filter('date')(startDate,'yyyy-MM-dd');
	    var on = '';
	    /*var whereCondition = '';
	    console.log(propFilters);
		var on = 'properties['' + propFilters[onFilterIndex].property + '']';
		console.log(on);
	    // build where condition
	    angular.forEach(propFilters, function(prop, i) {
			if (prop != null && (prop.operator != null && prop.value != null)){
		    	if (i > 0 ){
		    		whereCondition += ' and ';
		    	}			
	    		whereCondition += ''' + prop.value + '' ' + prop.operator + ' properties['' + prop.property + '']';
	    	}    	
		});
	    console.log(whereCondition);*/		
		return $http.get(SERVER_SETTINGS.url.retention.data, {
    		params: {'startDate': sd, 'endDate': ed, 'unit': unitValue, 
    			'returnEvent': returnEvent, 'bornEvent': bornEvent, 'dataAs': dataAs, 'intervalCount': 12}
		});
	}; 
  });
