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
 * @name sparkyApp.controller:AttributionCtrl
 * @description
 * # AttributionCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('AttributionCtrl', function ($scope, $filter, $timeout) {
/************************ data picker options ************************/
	$scope.dateRange = {startDate: moment().subtract(6, 'days').toDate(), endDate: moment().toDate()};
	$scope.datePickerOpts = {
		format: 'YYYY-MM-DD',
		opens:'left',
		applyClass:'btn-blue',
        ranges: {
           'This Week': [moment().subtract(6, 'days'), moment()],
           'Past Week': [moment().subtract(13, 'days'), moment()],
           '2 Weeks Ago': [moment().subtract(20, 'days'), moment()],
           '4 Weeks Ago': [moment().subtract(27, 'days'), moment()]
        },
        startDate: $scope.dateRange.startDate,
        endDate: $scope.dateRange.endDate
    };    
	//Watch for date changes
    $scope.$watch('dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate && 
        	newDateRange.endDate !== oldDateRange.endDate) {
        	populateAllCharts();
    	}	
    }, false);	  	
	/************************ Impact Events ************************/
	
	$scope.campaigns = ['Search Organic', 'Display', "Text", 'Social', 'Affiliates', 'Emails'];
	$scope.campaignsList = [];
	angular.forEach($scope.campaigns, function(name, index) {
		$scope.campaignsList.push({id: index, label: name});
	});

	/************************ Goal Events ************************/

	$scope.goalEvents = ['Purchase', 'Add to Cart'];
	$scope.sessionsToGoalData = [];


	$scope.goalEventsList = [];
	angular.forEach($scope.goalEvents, function(eventName, index) {
		$scope.goalEventsList.push({id: index, label: eventName});
	});
	$scope.selectedGoalEvent = {id: 0};
	$scope.selectedGoalEventName = $scope.goalEventsList[0].label;
	$scope.goalEventsText = {buttonDefaultText: 'Pick a goal event'};

	$scope.goalEventsSettings = {
    	smartButtonMaxItems: 1,
    	smartButtonTextConverter: function(itemText, originalItem) {
        	return $filter('limitTo')(itemText, 20, 0);
    	},
    	selectionLimit: 1,
    	showCheckAll: false,
    	showUncheckAll: false,
    	closeOnSelect: true,
    	closeOnDeselect: true		
    };	

    //assign goal event name
	function assignSelectedGoalEventName(){
		var e = $filter('filter')($scope.goalEventsList, {id: $scope.selectedGoalEvent['id']});	
		if(e.length > 0) {
			$scope.selectedGoalEventName = e[0].label;
		}
	}
    //when a goal event is selected, get data for the new event
	$scope.$watch('selectedGoalEvent.id', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
			$scope.goalEventSelected = true;
			assignSelectedGoalEventName();
			populateAllCharts();		
      	}
   	}); 
	/******** Weights ********/
	$scope.interactionWeights = {first: { weight: 45, max:100}, middle: {weight: 10, max: 100}, last: {weight: 45, max: 100}};
	
	//$scope.interactionWeights.lastInteraction = 100 - ($scope.interactionWeights.firstInteraction + $scope.interactionWeights.middleInteraction);

	//when a goal event is selected, get data for the new event
	$scope.$watchGroup(
			['interactionWeights.first.weight', 'interactionWeights.middle.weight', 'interactionWeights.last.weight'], 
			function(newValues, oldValues) {
		$scope.totalWeights = parseInt(newValues[0]) + parseInt(newValues[1]) + parseInt(newValues[2]);
		if($scope.totalWeights == 100) {
			populateWMChartData();
		}
   	});

	$scope.timeDecay = 10;	

	$scope.apllyTimeDecay = function(){
		populateTDChartData();
	};

	/************************ Chart Config ************************/
	// set of chart configs options (CCO)
	$scope.barChartConfigOptions = { //elapsed time to goal chart
        options: { 
        	colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
        	chart: {
        		type: 'line',
        		height: 250
        	},
        	legend: {
        		enabled: true
        	},
        	credits: {
        		enabled: false
        	},
        	yAxis: {
				title: {
                	text: null
            	},        	
        	},          	      
			title: {
            	text: null
        	},        	
	        tooltip: {
	            	headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '{point.x:%e %b}: {point.y:.2f}'
	        },
			plotOptions: {
	            column: {
	            	stacking: null,
	                pointPadding: 0.2,
	                borderWidth: 0,           	
	                dataLabels: {
	                    enabled: false,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
	                }
	            }            
	        }
    	},        
		xAxis: {},
        series: [],    
        loading: false
    };
    $scope.wmAttriCCO = {};
    $scope.tdAttriCCO = {};
    // copy the skelton chart config
    angular.copy($scope.barChartConfigOptions, $scope.wmAttriCCO);
    angular.copy($scope.barChartConfigOptions, $scope.tdAttriCCO);

    populateAllCharts();

    function populateAllCharts(){
	    populateWMChartData();
	    populateTDChartData();
	}

    //populate number of sessions to goal chart data
	function populateWMChartData() {
		$scope.wmAttriCCO.series = [];
		$scope.wmAttriCCO.xAxis.categories = $scope.campaigns;
		var seriesData = [];
		for (var i = 0; i < $scope.campaigns.length; i++) {
	    	seriesData.push(getRandomIntFromInterval(50,200)*1000)
		}		
		var series = {name: 'Campaign Attribution to Goal', data:seriesData, color: '#1F77B4'};
		$scope.wmAttriCCO.series.push(series);	
		$scope.wmAttriCCO.options.chart.type = 'column';
		$scope.wmAttriCCO.options.legend.enabled = false;
		$scope.wmAttriCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
	}

    //populate Sessions Duration To Goal chart data
	function populateTDChartData() {
		$scope.tdAttriCCO.series = [];
		$scope.tdAttriCCO.xAxis.categories = $scope.campaigns;
		var seriesData = [];
		angular.forEach($scope.campaigns, function(eventName, index) {
			seriesData.push(getRandomIntFromInterval(35,150)*100);
		});		
		var series = {name: 'Sessions to Goal', data:seriesData, color: '#1F77B4'};
		$scope.tdAttriCCO.series.push(series);	
		$scope.tdAttriCCO.options.chart.type = 'column';
		$scope.tdAttriCCO.options.legend.enabled = false;
		$scope.tdAttriCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} mins'};
	}

	function getRandomIntFromInterval(min,max)	{
    	return Math.floor(Math.random()*(max-min+1)+min);
	}

  });
