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
 * @name sparkyApp.controller:TrendCtrl
 * @description
 * # TrendCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('TrendCtrl', function ($scope, $timeout, $window, $location, $filter, EventService, events, eventsData) {
  	
  	// min and max dates for data selection - this is a global setting
  	$scope.dataDateRange = {
  		'minDate':  moment().subtract(90, 'days').toDate(),
  		'maxDate':  moment().toDate()
  	};

  	// tabs
  	$scope.tabs = [
  		{'title': 'User Trends', 'active':true, 'disable': false, 'contentTemplate':'views/trends/users.html'},
  		{'title': 'Session Trends', 'active':false, 'disable': false, 'contentTemplate':'views/trends/sessions.html'},
  		{'title': 'Event Trends', 'active':false, 'disable': false, 'contentTemplate':'views/trends/events.html'}
  	];

  	//$scope.onTab = $routeParams.t;
  	$scope.onTab = $location.search().t;
  	if($scope.onTab === undefined){
  		$scope.onTab = 0;
  	}else{
  		$scope.onTab = parseInt($scope.onTab);
  		$scope.tabs[$scope.onTab].active = true;
  	}

  	$scope.tabActivated = function(tabIndex){
  		$timeout(function() {
    		$scope.$broadcast('highchartsng.reflow');
		}, 10);
  		$scope.tabs[tabIndex].active = true;
  		if(tabIndex == 0){
  			populateAllUserCharts();
  		} else if (tabIndex == 1) {
  			populateAllSessionCharts();
  		} else if (tabIndex == 2){
  			/*var chart = this.eventTrendsCCO.getHighcharts();
  			$scope.$evalAsync(function () {
                //chart.reflow();
                //The below is an event that will trigger all instances of charts to reflow
                $scope.$broadcast('highchartsng.reflow');
            });*/
  			populateTrendsChartData();
  		}
  	};

  	// set of chart configs options (CCO)
	$scope.lineChartConfigOptions = {
        options: { 
        	colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
        	chart: {
        		type: 'line',
        		height: 250
        	},
        	legend :{
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
	            pointFormat: '{point.x:%e %b}: {point.y:.2f} m'
	        },
			plotOptions: {
	            line: {
	                dataLabels: {
	                    enabled: false
	                },
	                enableMouseTracking: false
	            }
	        }	            	
    	},        
		xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e %b',
                year: '%b'
            }
        },
        series: [],    
        func: function (chart) {
            $scope.$evalAsync(function () {
                chart.reflow();
                //The below is an event that will trigger all instances of charts to reflow
                //$scope.$broadcast('highchartsng.reflow');
            });
        },
        loading: false
    };

    $scope.eventTrendsCCO = {};
    $scope.sessionsTrendCCO = {};
    $scope.sessionsEventTrendCCO = {};
    $scope.usersTrendCCO = {};
    $scope.usersEventTrendCCO = {};
    // copy the skelton chart config
    angular.copy($scope.lineChartConfigOptions, $scope.eventTrendsCCO);
    angular.copy($scope.lineChartConfigOptions, $scope.sessionsTrendCCO);
    angular.copy($scope.lineChartConfigOptions, $scope.sessionsEventTrendCCO);
    angular.copy($scope.lineChartConfigOptions, $scope.usersTrendCCO);
    angular.copy($scope.lineChartConfigOptions, $scope.usersEventTrendCCO);

    // set of date ranges 
	$scope.datePickerOpts = {
		format: 'YYYY-MM-DD',
		opens:'left',
		applyClass:'btn-blue',
        ranges: {
           //'Today': [moment(), moment()],
           //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment()],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }; 

    $scope.eventDPO = {};
    $scope.sessionDPO = {};
    $scope.userDPO = {};
    angular.copy($scope.datePickerOpts, $scope.eventDPO);
    angular.copy($scope.datePickerOpts, $scope.sessionDPO);
    angular.copy($scope.datePickerOpts, $scope.userDPO);
  	
  	// viz type
  	$scope.vizType = "line";
  	$scope.changeVizType = function(){
  		$scope.showTable = !$scope.showTable;
  		if($scope.showTable){
  			$scope.vizType = "table";
  		} else {
  			$scope.vizType = "line";
  		}
        //getEventTrendsData(false);
        populateTrendsChartData();

  	};

	// interval 
	$scope.units = ['hour', 'day', 'week', 'month']
	$scope.unit = 'day';    
	$scope.setUnit = function(unit){
		$scope.unit = unit;
	};

	// event data type
	$scope.eventDataTypes = ['general', 'unique', 'average']
	$scope.eventDataType = 'general';  	
	$scope.setEventDataType = function(eventDataType){
		$scope.eventDataType = eventDataType;    
	};
   
	//Watch for changes
    $scope.$watchGroup(['unit','eventDataType'], function(newVals, oldVals) {
        if (newVals[0] !== oldVals[0] || newVals[1] !== oldVals[1]) {
        	//getEventTrendsData(false);
        	populateTrendsChartData();

    	}	
    }, false);     	

	/************************ data picker options ************************/
	$scope.eventsTrend = {dateRange: {startDate: moment().subtract(29, 'days').toDate(), endDate: moment().toDate()}};
	$scope.eventDPO.startDate = $scope.eventsTrend.dateRange.startDate;
	$scope.eventDPO.endDate = $scope.eventsTrend.dateRange.endDate;

	//Watch for date changes
    $scope.$watch('eventsTrend.dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate || 
        	newDateRange.endDate !== oldDateRange.endDate) {
        	console.log('here');
        	//getEventTrendsData(false);
        	populateTrendsChartData();
    	}	
    }, false);

    
	/************************ grid options ************************/
	$scope.trendsGridOptions = {
	    enableSorting: false,
    	exporterCsvFilename: 'eventsData_' + 
    		moment($scope.eventsTrend.dateRange.startDate).format('YYYY-MM-DD') + '_' + 
    		moment($scope.eventsTrend.dateRange.endDate).format('YYYY-MM-DD')  + '.csv',
    	/*enableGridMenu: true,
    	exporterMenuCsv: true,
    	gridMenuShowHideColumns: false,
    	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	    */
	    columnDefs: [],
	    data: [],
	    onRegisterApi: function(gridApi){ 
      		$scope.gridApi = gridApi;
    	}
	 };

	/************************ Chart Object ************************/
	// populate event names and ids
	$scope.events = events.data;
	$scope.eventsData = eventsData.data;
	$scope.selectedEventIds = [];
	$scope.selectedEventNames = [];
	angular.forEach($scope.events, function(eve) {
		$scope.selectedEventIds.push({'id': eve.id});
		$scope.selectedEventNames.push(eve.label);
	});

	populateTrendsChartData();

	/*
	* populate trends char data
	*/
	function populateTrendsChartData() {
		$scope.eventTrendsCCO.series = [];
		/*angular.forEach($scope.eventsData, function(series, index) {
			$scope.eventTrendsCCO.series.push(series);
		});	  	
		//console.log($scope.eventTrendsCCO.series);
		*/
		var days = moment($scope.eventsTrend.dateRange.endDate).diff(moment($scope.eventsTrend.dateRange.startDate), 'days');
        for (var j = 0; j < $scope.events.length; j++) {
            var series = {'name': $scope.events[j].label, 'data':[], color: $scope.eventTrendsCCO.options.colors[j]};
			for (var i = 0; i < days; i++) {
				var d = moment($scope.eventsTrend.dateRange.startDate).add(i, 'days').unix()*1000;
				series.data.push([d, getRandomIntFromInterval(3000, 15000)]);
			}
            $scope.eventTrendsCCO.series.push(angular.copy(series));   
        }
		$scope.eventTrendsCCO.options.chart.type = 'line';
		$scope.eventTrendsCCO.options.legend.enabled = true;		
		$scope.eventTrendsCCO.options.chart.height = 500;
	}

	/*
	* populate trends table data
	*/
	function populateTrendsTableData() {
		//console.log($scope.eventsData);
		$scope.trendsGridOptions.data = [];
		$scope.trendsGridOptions.columnDefs = [{name: 'Event', pinnedLeft:true, width: 200, enableColumnMenu: false}];  
		var cols = [];
		angular.forEach($scope.eventsData, function(series, index) {
			var values = {};
			values['Event'] = series['name'];			
			angular.forEach(series['data'], function(eventDetails, i) {
				values[$filter('date')(new Date(eventDetails[0]), 'yyyy-MM-dd')] = eventDetails[1];
				if (index == 0){
					cols.push(new Date(eventDetails[0]));
				}
			});
			$scope.trendsGridOptions.data.push(values);
		});
		// sort before submiting
		/*cols.sort(function(a, b){
		    var x = a;
		    var y = b;
		    return y-x;
		});*/
		angular.forEach(cols, function(colName, index) {
			$scope.trendsGridOptions.columnDefs.push(
				{ name: $filter('date')(colName, 'yyyy-MM-dd'), width: 100, 
					enableColumnMenu: false}); 
		}); 
	}

	/*
	* get fresh events data 
	*/
	function getEventTrendsData(exportData){
		EventService.getEventTrendsData($scope.eventsTrend.dateRange.startDate, 
				$scope.eventsTrend.dateRange.endDate, $scope.unit, $scope.eventDataType, 
				$scope.selectedEventNames, $scope.vizType).then(function(response){
			$scope.eventsData = response.data;		
			if(!exportData){
				if(!$scope.showTable){
					populateTrendsChartData();
				} else {
					populateTrendsTableData();
				}
			} else {
					populateTrendsTableData();
			}
		});
	}

	/************************ Export Data ************************/
	 //export data as csv using ui-grid functionality
	 // http://ui-grid.info/docs/#/tutorial/312_exporting_data_complex
	 $scope.exportData = function(){
	 	$scope.exporting = true;
	 	var waitTime = 500;
	 	// can be called when in chart view
 		if(!$scope.showTable){
 			getEventTrendsData(true);
	 		waitTime = 5000;
 		}
	 	$timeout(function() { 
      		var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      		$scope.gridApi.exporter.csvExport("all", "all", myElement );
	 		$scope.exporting = false;
		}, waitTime);

	 };

	/************************ multi-select event dropdown ************************/

	$scope.eventsText = {buttonDefaultText: 'All events'};

	$scope.eventsSettings = {
		/*idProp: 'eventId',
		displayProp: 'eventName',*/
    	smartButtonMaxItems: 2,
    	smartButtonTextConverter: function(itemText, originalItem) {
        	return itemText;
    	},
    	enableSearch: true
	};

	// fired event when an item is deselected
	$scope.eventDeselected = function(item){
		var eventName = null;
		var _event = $filter('filter')($scope.events, {id:item.id}, true);	
		if(_event.length > 0) {
			eventName =  _event[0]['label'];
			var i = $scope.selectedEventNames.indexOf(eventName);
			if(i != -1) {
				$scope.selectedEventNames.splice(i, 1);
			}	
		}
		var chart = $scope.eventTrendsCCO.getHighcharts();
		var chartSeries = chart.series;
		angular.forEach(chartSeries, function(series, i) {
			if (series.name === eventName){
				series.hide();
			}
		});
		//$(chart.series[0].data[1].graphic.element).attr("fill", "#444");	
	};

	// fired event when an item is selected
	$scope.eventSelected = function(item){
		var eventName = null;
		var _event = $filter('filter')($scope.events, {id:item.id}, true);	
		if(_event.length > 0) {
			eventName =  _event[0]['label'];
			var i = $scope.selectedEventNames.indexOf(eventName);
			if(i == -1) {
				$scope.selectedEventNames.push(name);
			}
		}
		var chart = $scope.eventTrendsCCO.getHighcharts();
		var chartSeries = chart.series;
		angular.forEach(chartSeries, function(series, i) {
			if (series.name === eventName){
				series.show();
			}
		});		
	};
	// fired event when all items are selected
	$scope.allEventsSelected = function(){
		$scope.selectedEventNames = [];
		angular.forEach($scope.events, function(_event) {
			$scope.selectedEventNames.push(_event.label);
			$scope.selectedEventIds.push({'id': _event.id});

		});	
		var chart = $scope.eventTrendsCCO.getHighcharts();
		var chartSeries = chart.series;
		angular.forEach(chartSeries, function(series, i) {
			series.show();
		});			
	};

	// fired event when all items are deselected
	$scope.allEventsUnselected = function(){
		$scope.selectedEventNames = [];
		var chart = $scope.eventTrendsCCO.getHighcharts();
		var chartSeries = chart.series;
		angular.forEach(chartSeries, function(series, i) {
			series.hide();
		});		

	};	 

	/******************* Sessions Data ********************/

	/************************ data picker options ************************/
	
	$scope.sessionsTrend = {dateRange: {startDate: moment().subtract(29, 'days').toDate(), endDate: moment().toDate()}};
	$scope.sessionDPO.startDate = $scope.sessionsTrend.dateRange.startDate;
	$scope.sessionDPO.endDate = $scope.sessionsTrend.dateRange.endDate;
	
	//Watch for date changes
    $scope.$watch('sessionsTrend.dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate || 
        	newDateRange.endDate !== oldDateRange.endDate) {
        	populateAllSessionCharts();        
    	}	
    }, false);

    populateAllSessionCharts();

    function populateAllSessionCharts(){		
		var days = moment($scope.sessionsTrend.dateRange.endDate).diff(moment($scope.sessionsTrend.dateRange.startDate), 'days');
		plotSessionsData(days);
		plotEventPerSessionsData(days);
		fetchSessionMetrics();		
	}

    //populate number of sessions to goal chart data
	function plotSessionsData(days) {
		$scope.sessionsTrendCCO.series = [];
		var eSessions = {'name': 'Existing Users', 'data':[], color: '#1F77B4'};
		var nSessions = {'name': 'New Users', 'data':[], color: '#FF7F0E'};
		for (var i = 0; i < days; i++) {
			var d = moment($scope.sessionsTrend.dateRange.startDate).add(i, 'days').unix()*1000;
			eSessions.data.push([d, getRandomIntFromInterval(3000, 15000)]);
			nSessions.data.push([d, getRandomIntFromInterval(0, 4000)]);
		}
		$scope.sessionsTrendCCO.series.push(eSessions);	
		$scope.sessionsTrendCCO.series.push(nSessions);	
		$scope.sessionsTrendCCO.options.chart.type = 'line';
		//$scope.sessionsTrendCCO.options.chart.width = 300;
		$scope.sessionsTrendCCO.options.legend.enabled = true;
		//$scope.sessionsTrendCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
	}

	//populate number of sessions to goal chart data
	function plotEventPerSessionsData(days) {
		$scope.sessionsEventTrendCCO.series = [];
		var eSessions = {'name': 'Events Per Session', 'data':[], color: '#1F77B4'};
		for (var i = 0; i < days; i++) {
			var d = moment($scope.sessionsTrend.dateRange.startDate).add(i, 'days').unix()*1000;
			eSessions.data.push([d, getRandomIntFromInterval(5, 25)]);
		}
		$scope.sessionsEventTrendCCO.series.push(eSessions);	
		$scope.sessionsEventTrendCCO.options.chart.type = 'line';
		//$scope.sessionsEventTrendCCO.options.chart.width = 300;
		$scope.sessionsEventTrendCCO.options.legend.enabled = false;
		//$scope.sessionsEventTrendCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
	}

	function fetchSessionMetrics(){
		$scope.sessionMetrics = [
			{label: 'avg. sessions per day', value: getRandomIntFromInterval(2500, 3500), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'avg. session duration', value: getRandomIntFromInterval(300, 1500), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'avg. events per session', value: getRandomIntFromInterval(5, 25), trend: getRandomIntFromInterval(-20, 20)},
			{label: 'total sessions', value: getRandomIntFromInterval(10000, 50000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'peak sessions', value: getRandomIntFromInterval(10000, 25000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'peak events per session', value: getRandomIntFromInterval(20, 30), trend: getRandomIntFromInterval(-20, 20)}
		];
	}
    
	function getRandomDate(start, end) {
    	return moment.unix(start.unix() + Math.random() * (end.unix() - start.unix()));
	}


	function getRandomIntFromInterval(min,max)	{
    	return Math.floor(Math.random()*(max-min+1)+min);
	}	

	/******************* User Data ********************/

	/************************ data picker options ************************/
	// Angular ui tabs set their own child scoope so to overcome that challenge - I have to set usersTrend.dateRange as usersTrend.dateRange
	$scope.usersTrend = { dateRange: {startDate: moment().subtract(29, 'days').toDate(), endDate: moment().toDate()}};
	$scope.userDPO.startDate = $scope.usersTrend.dateRange.startDate;
	$scope.userDPO.endDate = $scope.usersTrend.dateRange.endDate;
	
	//Watch for date changes
    $scope.$watch('usersTrend.dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate || 
        	newDateRange.endDate !== oldDateRange.endDate) {
        	populateAllUserCharts();        
    	}	
    }, false);

    populateAllUserCharts();

    function populateAllUserCharts(){		
		var days = moment($scope.usersTrend.dateRange.endDate).diff(moment($scope.usersTrend.dateRange.startDate), 'days');
		plotUsersData(days);
		plotEventPerUserData(days);
		fetchUserMetrics();		
	}

    //populate number of sessions to goal chart data
	function plotUsersData(days) {
		$scope.usersTrendCCO.series = [];
		var eUsers = {'name': 'Existing', 'data':[], color: '#1F77B4'};
		var nUsers = {'name': 'New', 'data':[], color: '#FF7F0E'};
		for (var i = 0; i < days; i++) {
			var d = moment($scope.usersTrend.dateRange.startDate).add(i, 'days').unix()*1000;
			eUsers.data.push([d, getRandomIntFromInterval(3000, 15000)]);
			nUsers.data.push([d, getRandomIntFromInterval(0, 4000)]);
		}
		$scope.usersTrendCCO.series.push(eUsers);	
		$scope.usersTrendCCO.series.push(nUsers);	
		$scope.usersTrendCCO.options.chart.type = 'line';
		$scope.usersTrendCCO.options.legend.enabled = true;
	}

	//populate number of sessions to goal chart data
	function plotEventPerUserData(days) {
		$scope.usersEventTrendCCO.series = [];
		var eUsers = {'name': 'Events Per User Per Day', 'data':[], color: '#1F77B4'};
		for (var i = 0; i < days; i++) {
			var d = moment($scope.sessionsTrend.dateRange.startDate).add(i, 'days').unix()*1000;
			eUsers.data.push([d, getRandomIntFromInterval(5, 25)]);
		}
		$scope.usersEventTrendCCO.series.push(eUsers);	
		$scope.usersEventTrendCCO.options.chart.type = 'line';
		//$scope.sessionsEventTrendCCO.options.chart.width = 300;
		$scope.usersEventTrendCCO.options.legend.enabled = false;
		//$scope.sessionsEventTrendCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
	}

	function fetchUserMetrics(){
		$scope.userMetrics = [
			{label: 'total users', value: getRandomIntFromInterval(15000, 20000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'avg. users per day', value: getRandomIntFromInterval(1500, 3000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'peak users', value: getRandomIntFromInterval(10000, 25000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'total events performed', value: getRandomIntFromInterval(20000, 30000), trend: getRandomIntFromInterval(-20, 20)}, 
			{label: 'avg. events per user', value: getRandomIntFromInterval(5, 25), trend: getRandomIntFromInterval(-20, 20)},
			{label: 'peak events', value: getRandomIntFromInterval(20, 30), trend: getRandomIntFromInterval(-20, 20)}
		];
	}

	function changeUserEventMetrics(){
		$scope.userMetrics.splice(3, 3);
		var newMetrics = [
			{label: 'total events performed', value: getRandomIntFromInterval(20000, 30000), trend: getRandomIntFromInterval(-20, 20)},
			{label: 'avg. events per user', value: getRandomIntFromInterval(5, 25), trend: getRandomIntFromInterval(-20, 20)},
			{label: 'peak events', value: getRandomIntFromInterval(20, 30), trend: getRandomIntFromInterval(-20, 20)}
			];
		angular.forEach(newMetrics, function(value, key){
			$scope.userMetrics.push(value);
		});
	}

	/************************ Goal Events ************************/

	$scope.goalEvents = ['Purchase', 'Add to Cart'];
	$scope.goalEventsList = [];
	angular.forEach($scope.goalEvents, function(eventName, index) {
		$scope.goalEventsList.push({id: index, label: eventName});
	});
	$scope.selected = {goalEvent: {id: 0}};
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
		var e = $filter('filter')($scope.goalEventsList, {id: $scope.selected.goalEvent['id']});	
		if(e.length > 0) {
			$scope.selectedGoalEventName = e[0].label;
		}
	}
    //when a goal event is selected, get data for the new event
	$scope.$watch('selected.goalEvent.id', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
			$scope.goalEventSelected = true;
			assignSelectedGoalEventName();
			var days = moment($scope.usersTrend.dateRange.endDate).diff(moment($scope.usersTrend.dateRange.startDate), 'days');
			plotEventPerUserData(days);	
			changeUserEventMetrics();	
      	}
   	});


  });
