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
 * @name sparkyApp.FunnelService
 * @description
 * # FunnelService
 * Service in the sparkyApp.
 */
angular.module('sparkyApp')
  .service('FunnelService', function ($http, $filter, SERVER_SETTINGS) {
		
  	
  	/*
  	* This function is executed when the page initiatlizes  - it gets the default funnel and passes it to the controller
  	*/
	this.loadDefaultFunnel = function() {
		var defaultFunnelId = 935439; // Ideally, we would want to pick it up from user's last state of itneraction
	    var ed = moment().format("YYYY-MM-DD");
	    var sd = moment().subtract(6, 'days').format("YYYY-MM-DD");
	    //var ed = $filter('date')(new Date(), "yyyy-MM-dd");
	    //var sd = $filter('date')(new Date().getTime() - (7 * 24 * 60 * 60 * 1000),"yyyy-MM-dd");
		return $http.get(SERVER_SETTINGS.url.funnels.data, {
				params: {id: defaultFunnelId, startDate: sd, endDate: ed}
			});
	}; 

  	/*
  	* This function is executed when the page initiatlizes  - it gets the list of funnels and passes it to the controller
  	*/
	this.loadFunnelsList = function(){
		return $http.get(SERVER_SETTINGS.url.funnels.list);
	}; 


	/*
  	* get funnel conversion rate
  	*/
	this.loadFunnelConversionRate = function(funnelId, startDate, endDate, vizType) {
		var ed = $filter('date')(endDate, "yyyy-MM-dd");
		var sd = $filter('date')(startDate,"yyyy-MM-dd");
		return $http.get(SERVER_SETTINGS.url.funnels.data, {
			params: {id: funnelId, startDate: sd, endDate: ed, cr:"y", viz: vizType}
		});
	}; 


	/*
  	* reload funnel when the period or funnel selection changes
  	*/
	this.reloadFunnel = function(funnelId, startDate, endDate, breakdown, vizType) {
		var ed = $filter('date')(endDate, "yyyy-MM-dd");
		var sd = $filter('date')(startDate,"yyyy-MM-dd");

		/*if (startDate instanceof Date){
		    ed = $filter('date')(endDate, "yyyy-MM-dd");
		    sd = $filter('date')(startDate,"yyyy-MM-dd");
		} else {
			ed = endDate.format("YYYY-MM-DD");
			sd = startDate.format("YYYY-MM-DD");
		}*/
		return $http.get(SERVER_SETTINGS.url.funnels.data, {
			params: {id: funnelId, startDate: sd, endDate: ed, bdv: breakdown, viz: vizType}
		});
	}; 

	/*
  	* Apply filters to funnel
  	*/
	this.filterFunnel = function(funnelId, startDate, endDate, breakdown, propFilters, onFilterIndex) {
	    var ed = $filter('date')(endDate, "yyyy-MM-dd");
	    var sd = $filter('date')(startDate,"yyyy-MM-dd");
	    /*
	    	var on = 'properties["mp_country_code"]';
	    	var where = '"harry" in properties["mp_keyword"] and ("CA" == properties["mp_country_code"] or "US" == properties["mp_country_code"])';
		*/

	    // last filter in the list is always the on (group by) filter
	    var on = 'properties["' + propFilters[onFilterIndex].name + '"]';
	    // build where condition
	    var whereCondition = '';
	    angular.forEach(propFilters, function(prop, i) {
			if (prop != null && (prop.operator != null && prop.value != null)){
		    	if (i > 0 ){
		    		whereCondition += " and ";
		    	}			
	    		whereCondition += '"' + prop.value + '" ' + prop.operator + ' properties["' + prop.name + '"]';
	    	}    	
		});
	    console.log(whereCondition);

		return $http.get(SERVER_SETTINGS.url.funnels.data, {
			params: {id: funnelId, startDate: sd, endDate: ed, bdv: breakdown, by: on, where: whereCondition}
		});
	};

	/*
  	* Apply filters to funnel
  	*/
	this.filterFunnelSecond = function(funnelId, startDate, endDate, breakdown, whereCondition, on) {
	    var ed = $filter('date')(endDate, "yyyy-MM-dd");
	    var sd = $filter('date')(startDate,"yyyy-MM-dd");
		return $http.get(SERVER_SETTINGS.url.funnels.data, {
			params: {id: funnelId, startDate: sd, endDate: ed, bdv: breakdown, by: on, where: whereCondition}
		});
	};


  });