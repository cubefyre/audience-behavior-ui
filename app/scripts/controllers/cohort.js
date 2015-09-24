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
 * @name sparkyApp.controller:CohortCtrl
 * @description
 * # CohortCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('CohortCtrl', function ($scope, $filter, $timeout, EventService, events, eventsData, CohortService) {


    $scope.templateUrl = 'views/misc/save-retention-popover.html';
    $scope.currentRetention = {title: null, birthEvent: null, returnEvent: null, period: null};
    $scope.popoverCurrentState = 'hide';
    
    $scope.saveRetention = function() {
        if ($scope.currentRetention.title != null){
            $scope.popoverCurrentState = 'hide';
        }
    };

    $scope.toggleRetentionPopover = function() {
        $scope.popoverCurrentState == 'show' ? $scope.popoverCurrentState = 'hide' : $scope.popoverCurrentState = 'show'; 
    };

    $scope.$watch('popoverCurrentState', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $timeout(function() {
                $('#saveRetentionTarget').trigger(newValue);
            }, 0);        
        }   
    }, false);

	/************************ data picker options ************************/
	$scope.dateRange = {startDate: moment().subtract(89, 'days').toDate(), endDate: moment().toDate()};
    $scope.currentRetention.period = $scope.dateRange;
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
            populateAllCharts();        
            $scope.currentRetention.period = newDateRange;
    	}	
    }, false);	


    /************************ populate from data given to the controller at the init stage ************************/
	$scope.eventList = events.data;
	$scope.eventListWithAny = [];
	angular.copy($scope.eventList, $scope.eventListWithAny);

	$scope.eventListWithAny.push({'id':$scope.eventListWithAny.length+1, 'label': 'any event'});

	$scope.selectedBirthEvent = {'id':4};
	$scope.selectedReturnEvent = {'id': $scope.eventListWithAny.length};
	
	$scope.selectedBirthEventName = null;
    assignSelectedBirthEventName();
	$scope.selectedReturnEventName = null;
    assignSelectedReturnEventName();

    $scope.selectBirthEventText = {buttonDefaultText: 'Select Birth Event'};
    $scope.selectReturnEventText = {buttonDefaultText: 'Select Return Event'};

	// event list dropdown settings
	$scope.eventListSettings = {
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

    //assign birth event name
    function assignSelectedBirthEventName(){
        var e = $filter('filter')($scope.eventList, {id: $scope.selectedBirthEvent['id']}); 
        if(e.length > 0) {
            $scope.selectedBirthEventName = e[0].label;
            $scope.currentRetention.birthEvent = e[0].label;
        }
    }

    //when a birth event is selected, get data for the new event
    $scope.$watch('selectedBirthEvent.id', function(newValue, oldValue) {
        if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
            //$scope.goalEventSelected = true;
            assignSelectedBirthEventName();
            populateAllCharts();        
        }
    }); 

    //assign birth event name
    function assignSelectedReturnEventName(){
        var e = $filter('filter')($scope.eventListWithAny, {id: $scope.selectedReturnEvent['id']}); 
        if(e.length > 0) {
            $scope.selectedReturnEventName = e[0].label;
            $scope.currentRetention.returnEvent = e[0].label;
        }
    }

    //when a birth event is selected, get data for the new event
    $scope.$watch('selectedReturnEvent.id', function(newValue, oldValue) {
        if (newValue !== oldValue && newValue !== undefined) { //undefined value if reset filter is hit
            //$scope.goalEventSelected = true;
            assignSelectedReturnEventName();
            populateAllCharts();        
        }
    });     


	$scope.units = ['hour', 'day', 'week', 'month'];
    $scope.dataChoices = ['number', 'percent'];
    $scope.dataAs = 'number';
	$scope.unit = 'week';

    

    /********** Weeks *******/
    $scope.numWeeks = [];
    for (var i = 0; i <= 9; i++)  {
        $scope.numWeeks.push('Week' + i);
    }
    // set of chart configs options (CCO)
    $scope.retentionCCO = {
        options: { 
            colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
            chart: {
                type: 'line',
                height: 400
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
                pointFormat: '{this.x}: {this.y:.2f} m'
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                }
            }                   
        },        
        xAxis: {
            /*type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e %b',
                year: '%b'
            }*/
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

    //$scope.retentionCCO = {};    
    //angular.copy($scope.chartConfigOptions, $scope.retentionCCO);

    function populateRetentionChart() {
        $scope.retentionCCO.series = [];
        $scope.retentionCCO.xAxis.categories = $scope.numWeeks;

        for (var i = 0; i < 5; i++) {
            var series = {'name': 'Cohort-' + i, 'data':[], color: $scope.retentionCCO.options.colors[i]};
            var max = getRandomIntFromInterval(25, 40);
            var min = max - 3;            
            angular.forEach($scope.numWeeks, function(value, key){
                var v = getRandomIntFromInterval(min, max);
                series.data.push(v);
                max = v;
                min = max - getRandomIntFromInterval(1, 3);
            });
            $scope.retentionCCO.series.push(series);   
        }
        $scope.retentionCCO.options.chart.type = 'line';
        $scope.retentionCCO.options.legend.enabled = true;
        //$scope.retentionCCO.options.tooltip = {headerFormat:'<b>{series.name}</b><br>'};

    }
	
    function fetchCohortMetrics(){
        $scope.cohortMetrics = [
            {label: 'total users', value: getRandomIntFromInterval(15000, 20000), trend: getRandomIntFromInterval(-20, 20)}, 
            {label: 'peak retention in cohort-4 in week-5', value: getRandomIntFromInterval(20, 30), trend: getRandomIntFromInterval(-10, 20)}, 
            {label: 'max drop in retention in cohort-2 in week-7', value: getRandomIntFromInterval(10, 20), trend: getRandomIntFromInterval(-10, 20)}
        ];
    }

    function getRandomIntFromInterval(min,max)  {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    /****** UI Grid *********/
    var cohortData = {
        "2015-03-09": {
            "counts": [
                13,
                1,
                0,
                1,
                0,
                0,
                0,
                0,
                0
            ],
            "first": 27
        },
        "2015-03-23": {
            "counts": [
                19,
                1,
                1,
                1,
                1,
                0,
                0
            ],
            "first": 32
        },
        "2015-02-23": {
            "counts": [
                26,
                2,
                4,
                5,
                2,
                2,
                2,
                0,
                1,
                0,
                0
            ],
            "first": 48
        },
        "2015-02-09": {
            "counts": [
                15,
                0,
                1,
                1,
                0,
                1,
                2,
                1,
                1,
                1,
                0
            ],
            "first": 29
        },
        "2015-03-16": {
            "counts": [
                16,
                1,
                2,
                0,
                1,
                1,
                1,
                0
            ],
            "first": 26
        },
        "2015-03-02": {
            "counts": [
                12,
                1,
                3,
                2,
                2,
                1,
                1,
                2,
                1,
                0
            ],
            "first": 25
        },
        "2015-03-30": {
            "counts": [
                27,
                0,
                0,
                0,
                0,
                0
            ],
            "first": 43
        },
        "2015-02-02": {
            "counts": [
                11,
                0,
                0,
                0,
                1,
                0,
                1,
                1,
                1,
                0,
                0
            ],
            "first": 21
        },
        "2015-01-26": {
            "counts": [
                4,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0
            ],
            "first": 17
        },
        "2015-01-19": {
            "counts": [
                4,
                0,
                0,
                0,
                0,
                1,
                1,
                0,
                0,
                0,
                0
            ],
            "first": 13
        },
        "2015-02-16": {
            "counts": [
                6,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "first": 13
        },
        "2015-01-12": {
            "counts": [
                11,
                0,
                1,
                1,
                0,
                1,
                0,
                1,
                0,
                0,
                0
            ],
            "first": 16
        },
        "2015-01-05": {
            "counts": [
                16,
                1,
                1,
                1,
                1,
                0,
                0,
                2,
                1,
                1,
                1
            ],
            "first": 31
        },
        "2015-04-06": {
            "counts": [
                11,
                0,
                1,
                0,
                0
            ],
            "first": 19
        }
    }; 



    //funnel grid options
    $scope.cohortGridOptions = {
        enableSorting: false,
        exporterCsvFilename: 'Cohort_Data_' + $scope.selectedBirthEventName + "_" +
            moment($scope.dateRange.startDate).format('YYYY-MM-DD') + '_' + 
            moment($scope.dateRange.endDate).format('YYYY-MM-DD')  + '.csv',
        columnDefs: [],
        data: [],
        onRegisterApi: function(gridApi){ 
            $scope.cohortGrid = gridApi;
        }
     };   

    function fetchRetentionData(){
        CohortService.getRetentionData($scope.selectedBirthEventName, $scope.selectedReturnEventName, 
            $scope.dateRange.startDate, $scope.dateRange.endDate, $scope.unit,
              $scope.dataAs, "", "", "")
        .then(function(response){
            $scope.cohortData = response.data; 
            //populateCohortTableData();
        });
    }


     //create table data - same logic for both breakdown and regular view
    function populateCohortTableData(){
        $scope.cohortGridOptions.data = [];
        $scope.cohortGridOptions.columnDefs = [];  
        var cols = [];
        
        //following code populates grid using a data object included here - we are getting data from the backend now
        angular.copy($scope.numWeeks, cols);
        cols.splice(0, 0, "Week");
        cols.splice(1, 0, "Users");
        //console.log(cols);
        var data = [];
        angular.forEach(cohortData, function(val, key) {
            var d = {Week: key, Users: val.first};
            angular.forEach(val.counts, function(c, index){
                d[$scope.numWeeks[index]] = c;
            });
            data.push(d);
        });
        data = $filter('orderBy')(data, 'Week');
        $scope.cohortGridOptions.data = data;

        /*
        // following code populats grid from data fetched from backend.
        angular.forEach($scope.cohortData[0], function(val, key) {
            cols.push(key);
        });

        $scope.cohortGridOptions.data = $scope.cohortData;
        */
        //console.log($scope.gridOptions.data);
        angular.forEach(cols, function(colName, index) {
            var colWidth = 75;            
            var colDef = { name: colName, width: colWidth, 
                    enableColumnMenu: false, cellClass: 'text-center'}; 
            if(index > 2){
                colDef['cellClass'] = function(grid, row, col, rowRenderIndex, colRenderIndex) {
                    var v = grid.getCellValue(row,col);
                    if (v > 4) {
                        return 'retention-bucket-five text-center';
                    } else if ( v > 2 && v <= 4) {
                        return 'retention-bucket-four text-center';
                    } else if ( v > 1 && v <= 2) {
                        return 'retention-bucket-three text-center';
                    } else {
                        return 'text-center';
                    }
                }
            }       
            $scope.cohortGridOptions.columnDefs.push(colDef); 
        }); 
        $scope.cohortGridOptions.columnDefs[0]["width"] = 100; 
        $scope.cohortGridOptions.columnDefs[0]["pinnedLeft"] = true; 
        $scope.cohortGridOptions.columnDefs[1]["pinnedLeft"] = true; 
        $scope.cohortGridOptions.columnDefs[2]["cellClass"] = 'retention-bucket-zero text-center'; 
    }  

    populateAllCharts();

    function populateAllCharts(){
        populateRetentionChart();
        fetchCohortMetrics();
        //fetchRetentionData();
        populateCohortTableData();
    }

    //export data as csv using ui-grid functionality
    $scope.exportData = function(){
        $scope.exporting = true;
        var waitTime = 500;
        $timeout(function() { 
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            $scope.cohortGrid.exporter.csvExport("all", "all", myElement );
            $scope.exporting = false;
        }, waitTime);
    };


    /***** Save Segment Related *********/
    $scope.savedSegments = [
        {title: 'Chrome Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
        {title: 'Chrome Users By Device', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
        {title: 'Google Search From Safari', on: 'properties["$device"]', whereCondition: '"google" in properties["$search_engine"] and "Safari" in properties["$browser"]'},
        {title: 'California Chrome Mobile User', on: 'properties["$device"]', whereCondition: '"California" in properties["$region"] and "iPhone" in properties["$device"]'},
        {title: 'Active Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'},
        {title: 'Engaged Facebook Users', on: 'properties["$device"]', whereCondition: '"Chrome" == properties["$browser"]'}
    ];

    $scope.loadSegment = function(id) {
        populateAllCharts();
    };
  });
