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
 * @name sparkyApp.EventService
 * @description
 * # EventService
 * Service in the sparkyApp. 
 */
angular.module('sparkyApp')
  .service('EventService', function ($http, $filter, SERVER_SETTINGS) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	
	/* 
	* get data for a given event over a period.
	*/
	this.getEventTrendsData = function(startDate, endDate, unitValue, eventType, events, vizType) {
		//var requestURL = 'http://localhost:19980/events/data';
		var sd = moment(startDate).unix();
		var ed = moment(endDate).unix();		
		/*if (startDate instanceof Date){
			sd = Math.floor((startDate.getTime() + startDate.getTimezoneOffset()*60*1000)/1000);
			ed = Math.floor((endDate.getTime() + endDate.getTimezoneOffset()*60*1000)/1000);
		} else {
			sd = startDate.unix();
			ed = endDate.unix();
		}*/
		return $http.get(SERVER_SETTINGS.url.events.data, {
    		params: {startDate: sd, endDate: ed, unit: unitValue, type: eventType, 
    				events: JSON.stringify(events), viz: vizType}
		});
		//return $http.post(requestURL, {query:querySt});		
	}; 

	/* 
	* used by segmentaion controller 
	*/
	this.getSegmentedEventData = function(startDate, endDate, unitValue, eventType, eventName, propFilters, onFilterIndex, chart) {
		//chart = typeof chart !== 'undefined' ? chart : true;
		//var requestURL = 'http://localhost:19980/segmentation/data';
	    // last filter in the list is always the on (group by) filter
		var ed = $filter('date')(endDate, "yyyy-MM-dd");
		var sd = $filter('date')(startDate,"yyyy-MM-dd");
	    var on = '';
	    var whereCondition = '';
	    console.log(propFilters);
		var on = 'properties["' + propFilters[onFilterIndex].property + '"]';
		console.log(on);
	    // build where condition
	    angular.forEach(propFilters, function(prop, i) {
			if (prop != null && (prop.operator != null && prop.value != null)){
		    	if (i > 0 ){
		    		whereCondition += " and ";
		    	}			
	    		whereCondition += '"' + prop.value + '" ' + prop.operator + ' properties["' + prop.property + '"]';
	    	}    	
		});
	    console.log(whereCondition);		
		return $http.get(SERVER_SETTINGS.url.segmentation.data, {
    		params: {"startDate": sd, "endDate": ed, "unit": unitValue, type: eventType, "event": eventName, "by": on, "where": whereCondition, "chart":chart}
		});
	}; 


	/* 
	* used by segmentaion controller 
	*/
	this.getSegmentedEventDataSecond = function(startDate, endDate, unitValue, eventType, eventName, whereCondition, on, chart) {
		//chart = typeof chart !== 'undefined' ? chart : true;
		//var requestURL = 'http://localhost:19980/segmentation/data';
	    // last filter in the list is always the on (group by) filter
		var ed = $filter('date')(endDate, "yyyy-MM-dd");
		var sd = $filter('date')(startDate,"yyyy-MM-dd");	
		return $http.get(SERVER_SETTINGS.url.segmentation.data, {
    		params: {"startDate": sd, "endDate": ed, "unit": unitValue, type: eventType, "event": eventName, "by": on, "where": whereCondition, "chart":chart}
		});
	}; 

	/*
	* Get a list of events data
	*/
	this.loadEventsData = function() {
		//var requestURL = 'http://localhost:19980/events/data';
		//return $http.get(SERVER_SETTINGS.url.events.data);
		return [];
	}; 

	/*
	* Get a list of events
	*/
	this.loadEvents = function(){
		//var requestURL = 'http://localhost:19980/events';
		return $http.get(SERVER_SETTINGS.url.events.list);
	};   
  });