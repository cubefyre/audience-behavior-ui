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
 * @name sparkyApp.controller:SegmentationCtrl
 * @description
 * # SegmentationCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('SegmentationCtrl', function ($scope, $filter, $timeout, EventService, events, eventsData, PropertiesService) {
	
	/************************ Event options ************************/
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
        	getEventTrendsData();
    	}	
    }, false);     	

	/************************ data picker options ************************/
	$scope.dateRange = {startDate: moment().subtract(29, 'days').toDate(), endDate: moment().toDate()};
	$scope.datePickerOpts = {
		format: 'YYYY-MM-DD',
		opens:'right',
		applyClass:'btn-blue',
        ranges: {
           //'Today': [moment(), moment()],
           //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'Last 90 Days': [moment().subtract(89, 'days'), moment()],
           'Last 180 Days': [moment().subtract(179, 'days'), moment()]
        },
        startDate: $scope.dateRange.startDate,
        endDate: $scope.dateRange.endDate
    };    
	
	//Watch for date changes
    $scope.$watch('dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate || 
        	newDateRange.endDate !== oldDateRange.endDate) {
        	getEventTrendsData();
    	}	
    }, false);

	/************************ Event Chart  Config Options ************************/
	$scope.segmentChartConfig = {
        options: { 
        	colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
        	chart: {
        		type: 'line'
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
	                    enabled: false
	                }
	            },
	            column: {
	            	stacking: null,
	                pointPadding: 0.2,
	                borderWidth: 0,           	
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
	                }
	            },
				pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
            	}	            
	        }
    	},        
		xAxis: {},
        series: [],    
        loading: false
    };	

	$scope.chartType = 'line';
	$scope.chartTypes = {'line':'line', 'bar':'column', 'pie':'pie'};

    $scope.swapChartType = function (chart) {
		$scope.segmentChartConfig.options.chart.type = chart;
    };

	/************************ Populate event data ************************/
	$scope.events = events.data;
	$scope.eventsData = eventsData.data;
	$scope.selectedEvent = {};
	$scope.selectedEventName = 'All Events';
	// poulate chart
	populateSegmentChartData();

	
	//populate trends chart data
	function populateSegmentChartData() {
		$scope.segmentChartConfig.series = [];
		$scope.segmentChartConfig.xAxis = {type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e %b',
                year: '%b'
            }
        };
		$scope.segmentChartConfig.options.chart.type = 'line';
		angular.forEach($scope.eventsData, function(series, index) {
			$scope.segmentChartConfig.series.push(series);
		});	  	
	}

	//get events data - regular or segmented
	function getEventTrendsData(){
		$scope.eventsToSend = [];
		if ($scope.eventSelected){
			$scope.eventsToSend.push($scope.selectedEventName);
		} else {
			angular.forEach($scope.events, function(_event, index) {
				$scope.eventsToSend.push(_event['label']);
			});
		}
		// decide where to send the request
		if($scope.segmentSteps.length > 0){
			getSegmentedEventData();
		}
		else{
			getNormalEventTrendsData();
		}


	}

	//get undisturbed events data 
	function getNormalEventTrendsData(){
		EventService.getEventTrendsData($scope.dateRange.startDate, 
				$scope.dateRange.endDate, $scope.unit, $scope.eventDataType, 
				$scope.eventsToSend, $scope.vizType).then(function(response){
			$scope.eventsData = response.data;		
			populateSegmentChartData();
		});
	}

	//event list dropdown settings
	$scope.eventsText = {buttonDefaultText: 'Pick an event to get started'};

	$scope.eventsSettings = {
    	smartButtonMaxItems: 1,
    	smartButtonTextConverter: function(itemText, originalItem) {
        	return $filter('limitTo')(itemText, 20, 0);
    	},
    	selectionLimit: 1,
    	showUncheckAll: false,
    	closeOnSelect: true,
    	closeOnDeselect: true		
    };	

	//assign event name
	function assignSelectedEventName(){
		var e = $filter('filter')($scope.events, {id: $scope.selectedEvent['id']});	
		if(e.length > 0) {
			$scope.selectedEventName = e[0].label;
		}
	}

	//when an event is selected, get data for the new event
	$scope.$watch('selectedEvent.id', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
			$scope.eventSelected = true;
			assignSelectedEventName();
			getEventTrendsData();
			$scope.segmentSteps = [{'property': null, 'operator':null, 'value':null}];
      	}
   	}); 

	/************************ Segments related ************************/
  	$scope.segmentSteps = [];
  	$scope.filterCounter = 0;
  	$scope.onFilterIndex = 0;

	
	// load filter propersties from service
  	PropertiesService.loadProperties().then(
  		function(response){
  			$scope.props = response.data; 
  			console.log($scope.props);
  	});

	//This method gets called when a property is selected. It applys the groupby filter and doesn't filter
	$scope.applyGroupbyCondition = function(propertyIndex){
		var propName = $scope.segmentSteps[propertyIndex].prop.dim_name;
		$scope.filterCounter += 1;
		$scope.onFilterIndex = propertyIndex;
		$scope.segmentSteps[propertyIndex].property = propName;
		$scope.segmentSteps[propertyIndex].isSelected = true;
		$scope.segmentSteps[propertyIndex].operator = null;
		getEventTrendsData();
	};

	//apply filter condition - when a value is selected for a property
	$scope.applyFilterCondition = function(propertyIndex){
		// only apply filter condition when the value is present
		if($scope.segmentSteps[propertyIndex].value != null){
			//applyFiltersOnFunnel();
			console.log($scope.segmentSteps[propertyIndex]);
			getEventTrendsData();
		}
	};

	//get fresh events data 
	function getSegmentedEventData(){
		EventService.getSegmentedEventData($scope.dateRange.startDate, 
				$scope.dateRange.endDate, $scope.unit, $scope.eventDataType, 
				$scope.eventsToSend, $scope.segmentSteps, $scope.onFilterIndex, $scope.chartType).then(function(response){
			$scope.eventsData = response.data;		
			populateGroupBySegmentChartData();
		});
	}

	//populate segmented chart data
	function populateGroupBySegmentChartData() {
		$scope.segmentChartConfig.series = [];
		$scope.segmentChartConfig.xAxis.categories = $scope.eventsData['categories'];
		var series = {name: $scope.selectedEventName, data:$scope.eventsData['series'], color: '#1F77B4'};
		$scope.segmentChartConfig.series.push(series);	
		$scope.segmentChartConfig.options.chart.type = 'column';
		$scope.segmentChartConfig.options.legend.enabled = false;
		$scope.segmentChartConfig.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Users'};
	}

	// called when add segment is clicked
	$scope.addNewSegmentProperty = function(){
		$scope.segmentSteps.push({'property': null, 'operator':null, 'value':null});
	};

	// remove a property from the segment steps
	$scope.removeSegmentProperty = function(propertyIndex){
		$scope.segmentSteps.splice(propertyIndex, 1);
		getEventTrendsData();
		$//scope.segmentSteps.push({'property': null, 'operator':null, 'value':null});
	};

	// where to show the 'by' label
	$scope.showLabelHere = function(propertyIndex){
		if( propertyIndex+1 == $scope.segmentSteps.length && $scope.segmentSteps[propertyIndex].value == null){
			return true;
		} else{
			return false;
		}
	};

	// Called when a condition expresson is removed from a filter
	$scope.resetSegmentConidtion = function(segmentIndex){
		$scope.segmentSteps[segmentIndex].visible = !$scope.segmentSteps[segmentIndex].visible;
		var segmentName = $scope.segmentSteps[segmentIndex];
		// if condition is collapsed, reset.
		if(!$scope.segmentSteps[segmentIndex].visible){
			$scope.segmentSteps[segmentIndex] = {'name': segmentName, 'checked':true, 'visible': false, 'operator':null, 'value':null};
		}
	};

	//reset all fitlers
	$scope.resetSegment = function(){
		$scope.selectedEvent = {};
		$scope.eventSelected = false;
		$scope.segmentSteps = [];
  		$scope.onFilterIndex = 0;
		getEventTrendsData();
    	$scope.currentSegment = {title: null, on: null, whereCondition: null};
	};  


	//reset all fitlers
	$scope.addNewSegment = function(){
		$scope.selectedEvent = {};
		$scope.eventSelected = false;
		$scope.segmentSteps = [];
  		$scope.onFilterIndex = 0;
		getEventTrendsData();
    	$scope.currentSegmentId = $scope.savedSegments.length;
    	$scope.currentSegment = {title: null, on: null, whereCondition: null};
	};

	/***** Save Segment Related *********/
	$scope.savedSegments = [
		{title: 'Chrome Users', on: '', whereCondition: '"Chrome" == properties["$browser"]'},
		{title: 'Chrome Users By Device', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
		{title: 'Google Search From Safari', on: 'properties["$device"]', whereCondition: '"google" in properties["$search_engine"] and "Safari" in properties["$browser"]'},
		{title: 'California Chrome Mobile User', on: 'properties["$device"]', whereCondition: '"California" in properties["$region"] and "iPhone" in properties["$device"]'},
		{title: 'Active Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
		{title: 'Engaged Facebook Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'}
	];

	$scope.templateUrl = 'views/misc/save-segment-popover.html';
    $scope.currentSegmentId = $scope.savedSegments.length;
    $scope.currentSegment = {title: null, on: null, whereCondition: null};
    $scope.popoverCurrentState = 'hide';
    
    $scope.saveSegment = function() {
        if ($scope.currentSegment.title != null){
		    var on = '';
		    var whereCondition = '';
			var on = 'properties["' + $scope.segmentSteps[$scope.onFilterIndex].property + '"]';
			console.log(on);
		    // build where condition
		    angular.forEach($scope.segmentSteps, function(prop, i) {
				if (prop != null && (prop.operator != null && prop.value != null)){
			    	if (i > 0 ){
			    		whereCondition += " and ";
			    	}			
		    		whereCondition += '"' + prop.value + '" ' + prop.operator + ' properties["' + prop.property + '"]';
		    	}    	
			});
		    console.log(whereCondition);	
		    $scope.savedSegments[$scope.currentSegmentId] = $scope.currentSegment;
	        $scope.popoverCurrentState = 'hide';
        }
    };

    $scope.removeSegment = function(id) {
		$scope.savedSegments.splice(id, 1);
    };

    $scope.loadSegment = function(id) {
		EventService.getSegmentedEventDataSecond($scope.dateRange.startDate, 
				$scope.dateRange.endDate, $scope.unit, $scope.eventDataType, 
				$scope.eventsToSend, $scope.savedSegments[id].whereCondition, $scope.savedSegments[id].on, $scope.chartType).then(function(response){
			$scope.eventsData = response.data;		
			populateGroupBySegmentChartData();
		});
    };

    $scope.toggleSegmentPopover = function() {
        $scope.popoverCurrentState == 'show' ? $scope.popoverCurrentState = 'hide' : $scope.popoverCurrentState = 'show'; 
    };

    $scope.$watch('popoverCurrentState', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $timeout(function() {
                $('#saveSegmentTarget').trigger(newValue);
            }, 0);        
        }   
    }, false);


  });
