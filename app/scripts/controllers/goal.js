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
 * @name sparkyApp.controller:GoalCtrl
 * @description
 * # GoalCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('GoalCtrl', function ($scope, $filter) {
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
	
	$scope.impactEvents = ['Video Laser 4x', 'Why Laser 4x', 'Easy to Use Video 4x', 'Reviews', '90-day Money Back', 
		'Skin Care', 'Free Shipping', 'Warranty'];
	$scope.impactEventsList = [];
	angular.forEach($scope.impactEvents, function(eventName, index) {
		$scope.impactEventsList.push({id: index, label: eventName});
	});
	$scope.selectedImpactEvent = {id: 0};
	$scope.selectedImpactEventName = $scope.impactEventsList[0].label;
	$scope.impactEventsText = {buttonDefaultText: 'Pick an impact event'};

	$scope.impactEventsSettings = {
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
    //assign event name
	function assignSelectedImpactEventName(){
		var e = $filter('filter')($scope.impactEventsList, {id: $scope.selectedImpactEvent['id']});	
		if(e.length > 0) {
			$scope.selectedImpactEventName = e[0].label;
		}
	}
    //when an event is selected, get data for the new event
	$scope.$watch('selectedImpactEvent.id', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
			$scope.impactEventSelected = true;
			assignSelectedImpactEventName();
			fetchImpactEventMetrics();
      	}
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

	/************************ Chart Config ************************/
	$scope.chartConfigOptions = { 
        options: { 
        	colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
        	chart: {
        		type: 'bar',
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
	            line: {
	                dataLabels: {
	                    enabled: true
	                }
	            },
	            column: {
	            	stacking: null,
	                pointPadding: 0.2,
	                borderWidth: 0,           	
	                dataLabels: {
	                    enabled: false,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
	                }
	            },
				pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                	distance: -20,
	                    enabled: true,
	                    format: '{point.percentage:.1f}%',
						style: {
                        	fontWeight: 'bold',
                        	color: 'white',
                        	textShadow: '0px 1px 2px black'
                    	}
                	}            
	        	}
	        }
    	},        
		xAxis: {},
        series: [],    
        loading: false
    };
    $scope.ettgCCO = {};
    $scope.stgCCO = {};
    $scope.sdtgCCO = {}; //session duration to goal chart
    $scope.doiptgCCO = {}; //distribution of impact pages to goal
    // copy the skelton chart config
    angular.copy($scope.chartConfigOptions, $scope.ettgCCO);
    angular.copy($scope.chartConfigOptions, $scope.stgCCO);
    angular.copy($scope.chartConfigOptions, $scope.sdtgCCO);
    angular.copy($scope.chartConfigOptions, $scope.doiptgCCO);

    // 
    populateAllCharts();

    function populateAllCharts(){
	    populateSessionsToGoalChartData();
	    populateElapsedTimeToGoalChartData();
	    populateSessionDurationToGoalChartData();
	    populateDistroImpactPagesToGoalChartData();
	}
   	$scope.identity = angular.identity;
    //populate number of sessions to goal chart data
	function populateSessionsToGoalChartData() {
		$scope.stgCCO.series = [];
		$scope.stgCCO.xAxis.categories = [];
		var seriesData = [];
		for (var i = 0; i < $scope.impactEvents.length; i++) {
	    	seriesData.push({key: $scope.impactEvents[i], val:Math.round(Math.random() * 15 + 1)})
		}
		seriesData = $filter('orderBy')(seriesData, 'val');
		var sortedSeriesData = [];
		angular.forEach(seriesData, function(value, key){
			$scope.stgCCO.xAxis.categories.push(value.key);
			sortedSeriesData.push(value.val);
		});
		//$scope.stgCCO.xAxis.categories = $scope.impactEvents;
		var series = {name: 'Sessions to Goal', data:sortedSeriesData, color: '#1F77B4'};
		$scope.stgCCO.series.push(series);	
		$scope.stgCCO.options.chart.type = 'bar';
		$scope.stgCCO.options.legend.enabled = false;
		$scope.stgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
	}

    //populate Elapsed Time To Goal chart data
	function populateElapsedTimeToGoalChartData() {
		var endTime = moment();
		var startTime = moment().subtract(7, 'days');
		$scope.ettgCCO.series = [];
		$scope.ettgCCO.xAxis.categories = $scope.impactEvents;
		var seriesData = [];
		for (var i = 0; i < $scope.impactEvents.length; i++) {
			var randomDate = getRandomDate(startTime, endTime);
			var duration = moment.duration(endTime.diff(randomDate));
			var hours = Math.ceil(duration.asHours());			
    		seriesData.push(hours);
		}
		seriesData = $filter('orderBy')(seriesData, $scope.identity);

		var series = {name: 'Elapsed Time to Goal', data:seriesData, color: '#1F77B4'};
		$scope.ettgCCO.series.push(series);	
		$scope.ettgCCO.options.chart.type = 'bar';
		$scope.ettgCCO.options.legend.enabled = false;
		$scope.ettgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} hours'};
	}

    //populate Sessions Duration To Goal chart data
	function populateSessionDurationToGoalChartData() {
		$scope.sdtgCCO.series = [];
		$scope.sdtgCCO.xAxis.categories = [];
		var seriesData = [];
		for (var i = 0; i < $scope.impactEvents.length; i++) {
	    	seriesData.push({key: $scope.impactEvents[i], val:getRandomIntFromInterval(5,20)})
		}
		seriesData = $filter('orderBy')(seriesData, 'val');
		var sortedSeriesData = [];
		angular.forEach(seriesData, function(value, key){
			$scope.sdtgCCO.xAxis.categories.push(value.key);
			sortedSeriesData.push(value.val);
		}); 
		var series = {name: 'Sessions to Goal', data:sortedSeriesData, color: '#1F77B4'};
		$scope.sdtgCCO.series.push(series);	
		$scope.sdtgCCO.options.chart.type = 'bar';
		$scope.sdtgCCO.options.legend.enabled = false;
		$scope.sdtgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} mins'};
	}

	//populate distribution of impact events to goal chart data
	function populateDistroImpactPagesToGoalChartData() {
		$scope.doiptgCCO.series = [];
		//$scope.doiptgCCO.xAxis.categories = $scope.impactEvents;
		var seriesData = [];
		var lastNumber = 100;
		angular.forEach($scope.impactEvents, function(eventName, index) {
			lastNumber = getRandomIntFromInterval(10,lastNumber);
			seriesData.push([eventName, lastNumber]);
		});		
		var series = {type: 'pie', innerSize: '50%', name: 'Share of Impact Pages to Goal', 
			data: seriesData, color: '#1F77B4'};		
		$scope.doiptgCCO.series.push(series);	
		$scope.doiptgCCO.options.legend.enabled = true;
		$scope.doiptgCCO.options.chart.type = 'pie';
		$scope.doiptgCCO.options.chart.margin = [0,0,0,0];
		$scope.doiptgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.name}: {point.percentage:.1f} %'};
	}

	function getRandomDate(start, end) {
    	return moment.unix(start.unix() + Math.random() * (end.unix() - start.unix()));
	}


	function getRandomIntFromInterval(min,max)	{
    	return Math.floor(Math.random()*(max-min+1)+min);
	}

	//shuffle function
	// -> Fisher–Yates shuffle algorithm
	var shuffleArray = function(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle
	  while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	};
	//shuffleArray($scope.questions);
	fetchImpactEventMetrics();
	function fetchImpactEventMetrics(){
		$scope.impactEventMetrics = [{label: 'avg. hops to purchase', value: getRandomIntFromInterval(1, 3.5), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'impact score', value: getRandomIntFromInterval(50, 100), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'as % of all impact pages', value: getRandomIntFromInterval(0, 100), trend: getRandomIntFromInterval(-20, 20)}
		];
	}
  });
