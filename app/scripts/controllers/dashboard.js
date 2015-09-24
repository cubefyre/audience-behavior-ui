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
 * @name sparkyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('DashboardCtrl', function ($scope, $interval, $filter, $window, $timeout, $modal, $log) {
   

    $scope.dashboard = {'goals': 2, 'paths':3, 'events': 5, 'campaigns': 9, 
        'pageviews': 17993, 'uvisitors': 723, 'visitors': 2643, 'payingUsers': 63,
        'sessionDuration':12, 'bounceRate': 58.3 };
    
    $scope.campaigns = ['Search Organic', 'Display', "Text", 'Social', 'Affiliates', 'Emails'];

    $scope.impactEvents = ['Video Laser 4x', 'Why Laser 4x', 'Easy to Use Video 4x', 'Reviews', '90-day Money Back', 
        'Skin Care', 'Free Shipping', 'Warranty'];
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

    /********** Weeks *******/
    $scope.numWeeks = [];
    for (var i = 0; i <= 9; i++)  {
        $scope.numWeeks.push('Week' + i);
    }
    /*
    $interval(function(){
        $scope.dashboard.pageviews += Math.round(Math.random() * 5);
        $scope.dashboard.visitors += Math.round(Math.random() * 3);
    },500);

    $interval(function(){
        $scope.dashboard.visitors += Math.round(Math.random() * 3);
    },1000);

    $interval(function(){
        $scope.dashboard.uvisitors += Math.round(Math.random() * 2);
    },1500);

    $interval(function(){
        $scope.dashboard.sessionDuration += getRandomNumberFromInterval(-.5,.75);
        $scope.dashboard.bounceRate += getRandomNumberFromInterval(-.5,1);
    },2500);

    $interval(function(){
        $scope.dashboard.payingUsers += Math.round(Math.random() * 1);
    },3000);
    */
    function getRandomIntFromInterval(min,max)  {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function getRandomNumberFromInterval(min,max)  {
        return Math.random()*(max-min)+min;
    }

    // set of chart configs options (CCO)
    $scope.chartConfigOptions = {
        options: { 
            colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
            chart: {
                type: 'line',
                height: 150
            },
            legend :{
                enabled: true
            },
            credits: {
                enabled: false
            },
            tooltip: {
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
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false
                },
                bar: {
                    stacking: null,
                    pointPadding: 0.2,
                    borderWidth: 0,             
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
                    }
                },
                pie: {
                    size: 250,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -20,
                        enabled: false,
                        format: '{point.percentage:.1f}%',
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '100%']            
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
    $scope.stgCCO = {};
    $scope.doiptgCCO = {};
    $scope.usersTrendCCO = {};
    $scope.retentionCCO = {};
    $scope.wmAttriCCO = {};

    // copy the skelton chart config
    angular.copy($scope.chartConfigOptions, $scope.eventTrendsCCO);
    angular.copy($scope.chartConfigOptions, $scope.stgCCO);
    angular.copy($scope.chartConfigOptions, $scope.doiptgCCO);
    angular.copy($scope.chartConfigOptions, $scope.usersTrendCCO);
    angular.copy($scope.chartConfigOptions, $scope.retentionCCO);
    angular.copy($scope.chartConfigOptions, $scope.wmAttriCCO);



    /************************ data picker options ************************/
    // Angular ui tabs set their own child scoope so to overcome that challenge - I have to set usersTrend.dateRange as usersTrend.dateRange
    $scope.dateRange =  {startDate: moment().subtract(6, 'days').toDate(), endDate: moment().toDate()};
    
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


    //Watch for date changes
    $scope.$watch('dateRange', function(newDateRange, oldDateRange) {
        if (newDateRange.startDate !== oldDateRange.startDate || 
            newDateRange.endDate !== oldDateRange.endDate) {
            populateAllCharts();        
        }   
    }, false);

    populateAllCharts();

    function populateAllCharts(){       
        var days = moment($scope.dateRange.endDate).diff(moment($scope.dateRange.startDate), 'days');
        plotUsersData(days);
        plotEventsData(days);
        populateSessionsToGoalChartData();
        keyMetrics();
        populateDistroImpactPagesToGoalChartData();  
        populateRetentionChart();  
        populateWMChartData(); 
    }



    //populate number of sessions to goal chart data
    function plotUsersData(days) {
        $scope.usersTrendCCO.series = [];
        var eUsers = {'name': 'Existing', 'data':[], color: '#1F77B4'};
        var nUsers = {'name': 'New', 'data':[], color: '#FF7F0E'};
        for (var i = 0; i < days; i++) {
            var d = moment($scope.dateRange.startDate).add(i, 'days').unix()*1000;
            eUsers.data.push([d, getRandomIntFromInterval(3000, 15000)]);
            nUsers.data.push([d, getRandomIntFromInterval(0, 4000)]);
        }
        $scope.usersTrendCCO.series.push(eUsers);   
        $scope.usersTrendCCO.series.push(nUsers);  
        $scope.usersTrendCCO.options.chart.type = 'line';
        $scope.usersTrendCCO.options.legend.enabled = false;
    }

    //populate number of sessions to goal chart data
    function plotEventsData(days) {
        $scope.eventTrendsCCO.series = [];
        var e = {'name': 'Existing', 'data':[], color: '#1F77B4'};
        for (var i = 0; i < days; i++) {
            var d = moment($scope.dateRange.startDate).add(i, 'days').unix()*1000;
            e.data.push([d, getRandomIntFromInterval(3000, 15000)]);
        }
        $scope.eventTrendsCCO.series.push(e);   
        $scope.eventTrendsCCO.options.chart.type = 'line';
        $scope.eventTrendsCCO.options.legend.enabled = false;

    }


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
        //$scope.stgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.y} Sessions'};
    }

    function keyMetrics(){
        $scope.keyMetrics = [
            {label: 'total users', value: getRandomIntFromInterval(15000, 20000), trend: getRandomIntFromInterval(-20, 20)}, 
            {label: 'avg. users per day', value: getRandomIntFromInterval(1500, 3000), trend: getRandomIntFromInterval(-20, 20)}, 
            {label: 'revenue', value: getRandomIntFromInterval(500000, 750000), trend: getRandomIntFromInterval(-20, 20)}, 
            {label: 'avg transactions', value: getRandomIntFromInterval(20000, 30000), trend: getRandomIntFromInterval(-20, 20)}, 
            {label: 'transactions per user', value: getRandomIntFromInterval(5, 25), trend: getRandomIntFromInterval(-20, 20)},
            {label: 'avg LTV per user', value: getRandomIntFromInterval(20, 30), trend: getRandomIntFromInterval(-20, 20)}
        ];
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
        //$scope.doiptgCCO.options.legend.enabled = true;
        $scope.doiptgCCO.options.chart.type = 'pie';
        $scope.doiptgCCO.options.chart.margin = [0, 0, 0, 0];
        $scope.doiptgCCO.options.legend.enabled = false;
        //$scope.doiptgCCO.options.tooltip.enabled = false;

        $scope.doiptgCCO.options.tooltip = {headerFormat:'', pointFormat:'{point.name}: {point.percentage:.1f} %'};
    }



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
        $scope.retentionCCO.options.legend.enabled = false;
        //$scope.retentionCCO.options.tooltip = {headerFormat:'<b>{series.name}</b><br>'};

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

    $scope.printDB = function(){
        $timeout(function() {
            $window.print();
        });
    };

  $scope.emailSettings = [
    {'name': 'Jack Dorsey', 'email': 'jack@orbit.com', 'group': 1, 'frequency': 2},
    {'name': 'Dick Costello', 'email': 'dick@orbit.com', 'group': 1, 'frequency': 2},
    {'name': 'Jeff Bush', 'email': 'jeff@orbit.com', 'group': 2, 'frequency': 1}
    ];

  $scope.configureEmail = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/misc/email-settings-modal.html',
      controller: 'EmailModalInstanceCtrl',
      size: 'lg',
      resolve: {
        emailSettings: function () {
          return $scope.emailSettings;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  });

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('sparkyApp').controller('EmailModalInstanceCtrl', function ($scope, $modalInstance, emailSettings) {

$scope.frequencies = [
    {value: 1, text: 'Daily'},
    {value: 2, text: 'Weekly'},
    {value: 3, text: 'Bi-Weekly'},
    {value: 4, text: 'Monthly'}
  ]; 

  $scope.groups = [
    {value: 1, text: 'Executive'},
    {value: 2, text: 'Director / Manager'},
    {value: 3, text: 'Analysts'}
  ];
 

  $scope.emailSettings = emailSettings;
  $scope.deleteEmail = function(index){
    $scope.emailSettings.splice(index, 1);
  };

  $scope.addNewEmailSetting = function(){
    $scope.emailSettings.push({'name': 'name', 'email': 'email@example.com', 'group': 0, 'frequency': 0});
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
