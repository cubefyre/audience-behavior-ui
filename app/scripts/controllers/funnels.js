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
 * @name sparkyApp.controller:FunnelsCtrl
 * @description
 * # FunnelsCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('FunnelsCtrl', 
  	function ($scope, $filter, $timeout, FunnelService, funnelList, funnelData, EventService, PropertiesService) {
    $scope.showFilters = false;
	/************************ Viz options ************************/

	$scope.vizType = "bar";
  	$scope.changeVizType = function(){
  		$scope.showTable = !$scope.showTable;
  		if($scope.showTable){
  			$scope.vizType = "table";
  		} else {
  			$scope.vizType = "bar";
  		}
        //getFunnelData(false);
        populateFunnelChartData();
  	};	

	/************************ data picker options ************************/
	$scope.dateRange = {startDate: moment().subtract(6, 'days').toDate(), endDate: moment().toDate()};
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
        	//getFunnelData(false);
        	populateFunnelChartData();
    	}	
    }, false);	
	
	/************************ Funnel Chart Config Options ************************/
	$scope.funnelChartConfig = {
        options: { 
        	chart: {
        		type: 'column'
        	},
        	credits: {
        		enabled: false
        	},
        	yAxis: {
				title: {
                	text: null
            	},        	
        	},  
			legend: {
	        	enabled: false
	    	},         	      
			title: {
            	text: null
        	},        	
			tooltip: {
	            /*
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
				*/	  
				headerFormat:'',
	            pointFormat: '{point.y} Users'
	        },
			plotOptions: {
	            column: {
	            	stacking: null,
	                pointPadding: 0.2,
	                borderWidth: 0,           	
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
	                    style: {
	                        /*textShadow: '0 0 3px black'*/
	                    }
	                }/*,
		            point: {
		                events: {
		                    mouseOut: function(){
		                        var point = this;
		                        console.log(point);
		                        setTimeout(function(){
		                            $(point.graphic.element).attr('fill', 'url(#pattern)');
		                        }, 0);
		                    },
		                    mouseOver: function(){
		                        var point = this;
		                        setTimeout(function(){
		                            $(point.graphic.element).attr('fill', 'url(#pattern2)');
		                        }, 0);
		                    }
		                }
		            }*/
		        }	            
	        }, 	            	
    	},
        colors: ["#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD", "#8C564B", "#E377C2", "#7F7F7F", "#BCBD22", "#17BECF"],
		xAxis: {
            categories: []
        },                      
        series: [],            
        loading: false,
        //function (optional)
		func: function (chart) {
			//chart.renderer.image('http://highcharts.com/demo/gfx/sun.png', 100, 100, 30, 30).add();			
			var r = chart.renderer,
        	pattern = r.createElement('pattern')
	            .attr({
	                id: 'pattern',
	                patternUnits: 'userSpaceOnUse',
	                x: 0,
	                y: 0,
	                width: 15,
	                height: 15,
	                viewBox: '0 0 10 10',
	            })
	            .add(r.defs);

			r.rect(0, 0, 10, 10, 0)
			   .attr('fill', '#ddd')
			.add(pattern);

			r.image('http://highcharts.com/demo/gfx/sun.png',0,0,30,30)
				.attr({
				stroke: '#333'
				})
			.add(pattern);

			pattern = r.createElement('pattern')
			    .attr({
			        id: 'pattern2',
			        patternUnits: 'userSpaceOnUse',
			        x: 0,
			        y: 0,
			        width: 15,
			        height: 15,
			        viewBox: '0 0 10 10',
			    })
			    .add(r.defs);

			r.rect(0, 0, 10, 10, 0)
				.attr('fill', '#333')
				.add(pattern);
    
			//hover status
			r.image('http://highcharts.com/demo/gfx/sun.png',0,0,30,30) 
				.attr({
					stroke: '#666'
				})
				.add(pattern);	
   			//chart.series[0].data[1].graphic.element.attr('fill', 'url(#pattern)');
   //$(chart.series[0].data[1].graphic.element).attr('fill', 'url(#pattern2)');

		}
    };

	/************************ watch breakdown funnel variable ************************/
	$scope.$watch('breakdownFunnelView', function(newValue, oldValue) {
		if (newValue !== oldValue) {
	  		//console.log("breakdown view triggered");
			//getFunnelData(false);
			populateFunnelChartData();
      	}
   	});
	
	/************************ populate from data given to the controller at the init stage ************************/
	$scope.funnelData = funnelData.data; // funnel data for the default funnel
	$scope.funnelList = funnelList.data; // list of funnel names and ids

	$scope.selectedFunnel = {};
	assignSelectedFunnelId();
	assignSelectedFunnelName();

	$scope.funnelChartData = []; //angular.copy($scope.funnelData);	
	$scope.tableData = {"headerRow":[], "rows":[]}; 	
	
	//populate funnel chart and table data
	populateFunnelChartData();
	
	// assign funnel id - expected by the multi-dropdown-select in this format {funnel_id: 1235343}
	function assignSelectedFunnelId(){
		var funnelId = 935439; //$scope.funnelData["funnel_id"];
		$scope.selectedFunnel["id"] = funnelId;
	}

	//assign funnel name
	function assignSelectedFunnelName(){
		var funnel = $filter("filter")($scope.funnelList, {id: $scope.selectedFunnel["id"]});	
		if(funnel.length > 0) {
			$scope.selectedFunnelName = funnel[0].label;
		}
	}

	// funnel list dropdown settings
	$scope.funnelListSettings = {
		//idProp: "funnel_id",
		//displayProp: "name",
    	smartButtonMaxItems: 1,
		smartButtonTextConverter: function(itemText, originalItem) {
        	return $filter('limitTo')(itemText, 20, 0);
    	},		
    	//enableSearch: true,
    	selectionLimit: 1,
    	//showCheckAll: false,
    	showUncheckAll: false,
    	closeOnSelect: true,
    	closeOnDeselect: true	
    };	

	//when a funnel is selected, get data for the new funnel
	$scope.$watch('selectedFunnel.id', function(newValue, oldValue) {
		if (newValue !== oldValue) {
	  		//console.log(newValue);
			assignSelectedFunnelName();
			//getFunnelData(false);
			populateFunnelChartData();
      	}
   	});    

	//funnel grid options
	$scope.funnelGridOptions = {
	    enableSorting: false,
    	exporterCsvFilename: 'Funnel_Data_' + $scope.selectedFunnelName + "_" +
    		moment($scope.dateRange.startDate).format('YYYY-MM-DD') + '_' + 
    		moment($scope.dateRange.endDate).format('YYYY-MM-DD')  + '.csv',
	    columnDefs: [],
	    data: [],
	    onRegisterApi: function(gridApi){ 
      		$scope.funnelGrid = gridApi;
    	}
	 };   	

	//populate chart data object
	function populateFunnelChartData() {
		//$scope.funnelChartData = [];
		$scope.funnelChartConfig.series = [];
		/*if($scope.breakdownFunnelView){
			//console.log($scope.funnelData.data);
			$scope.funnelChartConfig.options.plotOptions.column.stacking ='normal';
			$scope.funnelChartConfig.options.legend.enabled = true;			
			$scope.funnelChartConfig.xAxis.type = null;
			var i = 0;
			$scope.funnelChartConfig.xAxis.categories = $scope.funnelData.data.categories;
			angular.forEach($scope.funnelData.data.series, function(values, seriesName) {
				$scope.funnelChartConfig.series.push({"name": seriesName, "data": values,
				"color": $scope.funnelChartConfig.colors[i]});
				i++;
			});	

		} else {
			//console.log($scope.funnelData.data);
			$scope.funnelChartConfig.series = [];
			$scope.funnelChartConfig.options.plotOptions.column.stacking = null;
			$scope.funnelChartConfig.options.legend.enabled = false;	
			$scope.funnelChartConfig.series.push({"name": "funnel", 
					"data": $scope.funnelData.data.series, "color": "#1F77B4"});
			$scope.funnelChartConfig.xAxis.categories = $scope.funnelData.data.categories;		
		}*/
		console.log($scope.selectedFunnel.id);
		$scope.funnelLength = 3;
		$scope.funnelCategories = ["Video Laser 4x", "Add to Cart", "Purchase"];
		$scope.funnelLabel = $scope.funnelList[1].label;
		if ($scope.selectedFunnel.id == 935440) {
			$scope.funnelLength = 2;
			$scope.funnelCategories = ["Add to Cart", "Purchase"];
			$scope.funnelLabel = $scope.funnelList[0].label;
		}

		var seriesData = getRandomIntFromInterval(1000,70000,$scope.funnelLength);
		var series = {name: $scope.funnelLabel, data:seriesData, color: '#1F77B4'};
		$scope.funnelChartConfig.series.push(series);	
		$scope.funnelChartConfig.options.chart.type = 'column';
		$scope.funnelChartConfig.options.legend.enabled = false;
		$scope.funnelChartConfig.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Users'};
		$scope.funnelChartConfig.options.plotOptions.column.stacking = null;
		$scope.funnelChartConfig.xAxis.categories = $scope.funnelCategories;		
	}

	//create table data - same logic for both breakdown and regular view
	function populateFunnelTableData(){
		$scope.funnelGridOptions.data = [];
		$scope.funnelGridOptions.columnDefs = [];  
		var cols = [];
		$scope.funnelGridOptions.data = $scope.funnelData.data;
		//console.log($scope.gridOptions.data);
		angular.forEach($scope.funnelData.data[0], function(val, key) {
			cols.push(key);
		});
		angular.forEach(cols, function(colName, index) {
			var colWidth = 200;
			if($scope.breakdownFunnelView)
				colWidth = 100;
			var colDef = { name: colName, width: colWidth, 
					enableColumnMenu: false};
			$scope.funnelGridOptions.columnDefs.push(colDef); 
		});	
		$scope.funnelGridOptions.columnDefs[0]["pinnedLeft"] = true; 
	}
	
	//get funnel data from the server
	function getFunnelData(exportData){
	  	FunnelService.reloadFunnel($scope.selectedFunnel.id, $scope.dateRange.startDate, 
	  		$scope.dateRange.endDate, $scope.breakdownFunnelView, $scope.vizType).then(function(response){
			$scope.funnelData = response.data;
			if(!exportData){
				if(!$scope.showTable){
					populateFunnelChartData();
					loadFunnelCR();
				} else {
					populateFunnelTableData();
				}
			} else {
					populateFunnelTableData();
			}			
	  	});
        //var chart = this.funnelChartConfig.getHighcharts();
        //$(chart.series[0].data[0].graphic.element).attr("fill", 'url(#pattern)');
        //$(chart.series[0].data[1].graphic.element).attr("fill", "#444");	  		
	}

	//export data as csv using ui-grid functionality
	$scope.exportData = function(){
		$scope.exporting = true;
	 	var waitTime = 500;
		// can be called when in chart view
		if(!$scope.showTable){
			$scope.vizType = "table";
			//getFunnelData(true);
			populateFunnelChartData();
	 		waitTime = 5000;
		}
		$timeout(function() { 
			var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
			$scope.funnelGridApi.exporter.csvExport("all", "all", myElement );
			$scope.exporting = false;
		}, waitTime);
	};


	/************************ Funnel Conversion ************************/
	// Funnel Conversion Chart Object
	$scope.funnelConversionRateChartConfig = {
        options: { 
        	colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
        	chart: {
        		type: 'line'
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
			plotOptions: {
	            line: {
	                dataLabels: {
	                    enabled: true
	                },
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
        loading: false
    };	
    
    // Load this funnel's coversion rate
    loadFunnelCR();	
	
	// get funnel coversion rate 
	function loadFunnelCR(){
	  	FunnelService.loadFunnelConversionRate($scope.selectedFunnel.id, $scope.dateRange.startDate, 
	  		$scope.dateRange.endDate, "line").then(function(response){
			$scope.funnelConversionRateData = response.data.data;
			populateFunnelConversoinData();	
			populateConversionRateTableData();		
	  	});
	}

	//populate conversion rate chart data
	function populateFunnelConversoinData() {
		$scope.funnelConversionRateChartConfig.series = [];
		$scope.funnelConversionRateChartConfig.series.push($scope.funnelConversionRateData[0]);  	
	}	

	//converion grid options
	$scope.conversionRateGridOptions = {
	    enableSorting: false,
    	exporterCsvFilename: 'Funnel_Conversion_Data_' + $scope.selectedFunnelName + "_" +
    		moment($scope.dateRange.startDate).format('YYYY-MM-DD') + '_' + 
    		moment($scope.dateRange.endDate).format('YYYY-MM-DD')  + '.csv',
	    columnDefs: [],
	    data: [],
	    onRegisterApi: function(gridApi){ 
      		$scope.conversionRateGridApi = gridApi;
    	}
	 };

	//populate conversion rate table data
	function populateConversionRateTableData() {
		//console.log($scope.eventsData);
		$scope.conversionRateGridOptions.data = [];
		$scope.conversionRateGridOptions.columnDefs = [{name: 'ConversionRate', pinnedLeft:true, width: 200, enableColumnMenu: false}];  
		var cols = [];
		angular.forEach($scope.funnelConversionRateData, function(series, index) {
			var values = {};
			values['ConversionRate'] = series['name'];			
			angular.forEach(series['data'], function(eventDetails, i) {
				values[$filter('date')(new Date(eventDetails[0]), 'yyyy-MM-dd')] = eventDetails[1];
				if (index == 0){
					cols.push(new Date(eventDetails[0]));
				}
			});
			$scope.conversionRateGridOptions.data.push(values);
		});
		angular.forEach(cols, function(colName, index) {
			$scope.conversionRateGridOptions.columnDefs.push(
				{ name: $filter('date')(colName, 'yyyy-MM-dd'), width: 100, 
					enableColumnMenu: false}); 
		}); 
	}

	// Export Conversion Data
	$scope.exportConversionRateData = function(){
			var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
			$scope.conversionRateGridApi.exporter.csvExport("all", "all", myElement );
	};

	
	/************************ Filters ************************/

  	/*$scope.selectedFilters = [{"seq":1, "prop": ""}];*/
  	$scope.selectedFilters = [];
  	$scope.filterCounter = 0;
  	$scope.onFilterIndex = 0;
   	//watch showFilters funnel variable 
	$scope.$watch('showFilters', function(newValue, oldValue) {
		if (newValue !== oldValue) {
	  		if (newValue) {
	  			/* load filter propersties from service */
			  	PropertiesService.loadProperties().then(
			  		function(response){
			  			$scope.props = response.data; 
			  	});
	  		}
      	}
   	});

	function populateFilterFunnelChartData() {
		/*$scope.funnelChartData = [];
		var seriesData = $scope.funnelData.data["$overall"];
		console.log(seriesData);
		var series = {"key": "funnel", "values":[]};
		angular.forEach(seriesData, function(obj, key) {
			series.values.push([key, obj.count]);
		});
		$scope.funnelChartData.push(series);			
		console.log($scope.funnelChartData);*/
		var series = $scope.funnelData.data["$overall"];
		var data = [];
		var categories = [];
		angular.forEach(series, function(value, key){
			data.push(value.count);
			categories.push(key);
		});
		$scope.funnelChartConfig.series = [];
		$scope.funnelChartConfig.options.plotOptions.column.stacking = null;
		$scope.funnelChartConfig.options.legend.enabled = false;	
		$scope.funnelChartConfig.series.push({"name": "funnel", 
				"data": data, "color": "#1F77B4"});
		$scope.funnelChartConfig.xAxis.categories = categories;			
	}

	/*
	* create table data
	*/
	function populateFilterFunnelTableData(){
		$scope.tableData.headerRow = [];
		$scope.tableData.rows = [];
		angular.forEach($scope.funnelData.data, function(value, prop){
			var row = [];
			row.push(prop); // first cell - property is the value for this cell
			angular.forEach(value, function(v,k){
				if($scope.tableData.headerRow.indexOf(k) == -1)
					$scope.tableData.headerRow.push(k);
				row.push(v.count);
			});
			$scope.tableData.rows.push(row);
		});
	}

	/*
	* When called, this method invokes the filter service and asks to get the filter applied on the property.
	*/
	function applyFiltersOnFunnel() {
	  	FunnelService.filterFunnel($scope.selectedFunnel.funnelId, $scope.startDate, 
	  		$scope.endDate, $scope.breakdownFunnelView, $scope.selectedFilters, $scope.onFilterIndex).then(function(response){
			$scope.funnelData = response.data;
			console.log($scope.funnelData);	
			populateFilterFunnelTableData();
			populateFilterFunnelChartData();
	  	});
	}   	
  	
	/*
	* This method gets called when a check box is selected. It applys the groupby filter
	*/
	$scope.toggleGroupByFilter = function(filterName, filterIndex){
		if($scope.selectedFilters[filterIndex].checked){
			$scope.filterCounter += 1;
			$scope.onFilterIndex = filterIndex;
			$scope.selectedFilters[filterIndex] = {"name": filterName, "checked":true, "visible": false, "operator":null, "value":null};
		} else {
			console.log("un-applying filter " + filterName);
			$scope.selectedFilters[filterIndex] = {"name": filterName, "checked":false, "visible": false, "operator":null, "value":null};
			$scope.filterCounter -= 1;
			//$scope.selectedFilters.splice(filterIndex, 1);
		}
		if($scope.filterCounter > 0){ //if one or more filtes are present
			applyFiltersOnFunnel();
		}
		else { //if no filters left, reload funnel
			//getFunnelData();
			populateFunnelChartData();
		}
	};

	/* 
	* Called when a condition expresson changes on a filter
	*/
	$scope.applyFilterCondition = function(filterIndex){
		console.log($scope.selectedFilters[filterIndex]);
		// only apply filter condition when the value is present
		if($scope.selectedFilters[filterIndex].value != null){
			applyFiltersOnFunnel();
		}
	};

	/* 
	* Called when a condition expresson is removed from a filter
	*/
	$scope.resetFilterConidtion = function(filterName, filterIndex){
		$scope.selectedFilters[filterIndex].visible = !$scope.selectedFilters[filterIndex].visible;
		// if condition is collapsed, reset.
		if(!$scope.selectedFilters[filterIndex].visible){
			$scope.selectedFilters[filterIndex] = {"name": filterName, "checked":true, "visible": false, "operator":null, "value":null};
			applyFiltersOnFunnel();
		}
	};

	/* 
	* reset all fitlers
	*/
	$scope.resetFilters = function(){
		//$scope.showFilters = false;
		$scope.selectedFilters = [];
		//getFunnelData();
		populateFunnelChartData();
	};

	/****************************************************************/
	/* Create new funnel related */ 
    $scope.prepareNewFunnel = function(){
	    $scope.newFunnel = {"steps":[{"id": -1, "name": "", "count":0}, {"id": -1, "name": "", "count":0}]};
		$scope.newFunnelChartData = [{"key": "funnel", "values":[]}];
		$scope.newFunnelName = null;
    	$scope.createNewFunnel = ! $scope.createNewFunnel;
		EventService.loadEvents().then(function(response){
			$scope.events = response.data;
		 });
    };

    $scope.saveNewFunnel = function(){
    	if ($scope.newFunnelName != null && $scope.newFunnelChartData[0].values.length > 1)
    		$scope.createNewFunnel = ! $scope.createNewFunnel;
    };

    $scope.isLastFunnelStep = function(index){
    	return (index+1) == $scope.newFunnel.steps.length;
    };

    $scope.addNewStepToFunnel = function(){
    	//$scope.newFunnelSteps += 1;
    	$scope.newFunnel.steps.push({"id": -1, "name": "", "count":0});
    };

    $scope.removeStepFromFunnel = function(){
    	//$scope.newFunnelSteps -= 1;
    	//$scope.newFunnelStepEventIds.pop();
    	$scope.newFunnel.steps.pop();
    	$scope.newFunnelChartData[0].values.pop();
    	//setFunnelEventNames();
		//console.log($scope.selectedEventNames);
		//get event data
  		//getNewFunnelData();
    };

    function getNewEventData(index){
    	var eventName = $scope.newFunnel.steps[index].name;
		EventService.getEventsChartData($scope.startDate, 
  			$scope.endDate, $scope.unit, $scope.eventDataType, [eventName]).then(function(response){
			$scope.eventsChartData = [];
    		var charData = angular.fromJson(response.data);
    		//console.log(charData);
			var seriesVal = charData.values[eventName];
			var totalCount = 0;
			angular.forEach(seriesVal, function(eventCount, eventDate) {
    			totalCount += eventCount;
    		});
    		$scope.newFunnel.steps[index].count = totalCount;
    		// if series exist, update else push
    		if($scope.newFunnelChartData[0].values.length < (index+1))
				$scope.newFunnelChartData[0].values.push([eventName, totalCount]);
			else 
				$scope.newFunnelChartData[0].values[index] = [eventName, totalCount];
    	});
    }


    $scope.funnelStepSelected = function(index){
		var selectedEventId = $scope.newFunnel.steps[index].id;
		var _event = $filter("filter")($scope.events, {eventId: selectedEventId}, true);	
		if(_event.length > 0) {
			var eventName =  _event[0]["eventName"];
			$scope.newFunnel.steps[index].name = eventName;
		}
		//get event data
  		getNewEventData(index);
    };

    function getFunnelStepEvents(){
    	var eventNames = [];
    	angular.forEach($scope.newFunnel.steps, function(step){
    		eventNames.push(step.name);
    	});
    	return eventNames;
    }

    /*
		reload new funnel data when a new period is selected 
	*/
	$scope.reloadNewFunnel = function($index, period){
		var eventNames = getFunnelStepEvents();
		$scope.selectedPeriod = $index;
    	$scope.startDate = new Date($scope.endDate.getTime() - (period * 24 * 60 * 60 * 1000));
    	// reload data
    	EventService.getEventsChartData($scope.startDate, 
  			$scope.endDate, $scope.unit, $scope.eventDataType, eventNames).then(function(response){
			$scope.eventsChartData = [];
    		var charData = angular.fromJson(response.data);
    		console.log(charData);
			angular.forEach(charData.values, function(eventSeries, eventName) {
				var totalCount = 0;
    			angular.forEach(eventSeries, function(eventCount, eventDate) {
    				totalCount += eventCount;
    			});
    			// find the series which has this name and update value
    			var index = eventNames.indexOf(eventName);
    			console.log(index);
				$scope.newFunnel.steps[index].count = totalCount;
				$scope.newFunnelChartData[0].values[index][1] = totalCount;

				/*var step = $filter("filter")($scope.newFunnel.steps, {name: seriesName}, true);	
				if(step.length > 0) {
					var index = $scope.newFunnel.steps.indexOf(step);
					console.log(index);
				}*/			

			});
    	});
	};

	/***** Save Segment Related *********/
    $scope.savedSegments = [
        {title: 'Chrome Users By Device', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
        {title: 'Google Search From Safari', on: 'properties["$device"]', whereCondition: '"google" in properties["$search_engine"] and "Safari" in properties["$browser"]'},
        {title: 'California Chrome Mobile User', on: 'properties["$device"]', whereCondition: '"California" in properties["$region"] and "iPhone" in properties["$device"]'},
        {title: 'Active Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
        {title: 'Engaged Facebook Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'}
    ];

    $scope.loadSegment = function(id) {
	  	FunnelService.filterFunnelSecond($scope.selectedFunnel.id, $scope.dateRange.startDate, 
	  		$scope.dateRange.endDate, $scope.breakdownFunnelView, $scope.savedSegments[id].whereCondition, $scope.savedSegments[id].on).then(function(response){
			$scope.funnelData = response.data;
			populateFilterFunnelChartData();
	  	});
    };

	function getRandomIntFromInterval(min,max,number)	{
		var data = [];
		var minT = min;
		var maxT = max;
    	for (var i = 0; i < number; i++) {
    		if (i ==0) 
    			var minT = min * 5;
    		else if (i == 1)
    			var maxT = minT;
    		else 
    			var maxT = minT*0.1;
    		data.push(Math.floor(Math.random()*(maxT-minT+1)+minT));
    	}
    	return data;
	}


  });