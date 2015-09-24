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
 * @name sparkyApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the sparkyApp
 */
angular.module('sparkyApp')
  .controller('SettingsCtrl', function ($scope, $filter, $routeParams, $location, $timeout, OnboardingService) {
  	//console.log($routeParams.onStep);
  	/************ Steps Releated *******************************/
  	$scope.steps = [{title: 'Onboard Data', icon: 'fa-upload'}, 
  	{title: 'Map Entities', icon: 'fa-sitemap'},
  	{title: 'Define Metrics', icon: 'fa-pencil'},
  	{title: 'Design Analysis', icon: 'fa-line-chart'},
  	{title: 'Deploy & Launch', icon: 'fa-cubes'}]
  	
  	//$scope.onStep = $routeParams.onStep;
  	$scope.onStep = $location.search().onStep;
  	if($scope.onStep === undefined){
  		$scope.onStep = 0;
  	}else{
  		$scope.onStep = parseInt($scope.onStep);
  	} 

  	/*$scope.$watch('onStep', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value
			if(newValue == 1){
				defineEntities();
			}
		}
	});*/

    // go to next step
    $scope.nextStep = function(){
    	$scope.onStep += 1;
    	$location.search('onStep', $scope.onStep);
    };

    // go to previous step
    $scope.previousStep = function(){
    	$scope.onStep -= 1;
    	$location.search('onStep', $scope.onStep);
    };

    // go to current step - to design templates
    $scope.currentStep = function(){
    	$location.search('onStep', $scope.onStep);
    	$location.search('analysisTemplate', undefined);

    };

    $scope.nextStepTitle = function(currentStep){
    	return $scope.steps[currentStep+1].title;
    };
    
    $scope.previousStepTitle = function(currentStep){
    	return $scope.steps[currentStep-1].title;
    };    

  	/************** data source selection related **************************/

  	$scope.datasource = {}; //used by select2 to save selected choice - can't muck with this
  	$scope.supportedDatasources = [{name: "HDFS"}, {name: "S3"}, {name: "Redshift"}, {name: "Mongo"}];
  	$scope.ds = {};

	//when an ds is selected, get data for the new event
	$scope.$watch('datasource.selected.name', function(newValue, oldValue) {
		if (newValue !== oldValue && newValue !== undefined) { //undefined value
			$scope.ds.name = newValue;
			$scope.ds.bucketURL = "s3://yahoo-photos-event-logs"
			$scope.ds.secretAccessKey = 'unTfzEA33cY5AXK4+JqFZdBXEBqH+XenHURADlkr';
			$scope.ds.accessKeyId = 'AKIAIOVG3I235W5NVR4A';
			$scope.fetchingSampleText = "Fetch Sample Data From S3";
			$scope.fetchingSample = false;
			$scope.dataType = null;
			$scope.dataFrequency = null;

      	}
   	}); 
  	//Watch for changes
    $scope.$watchGroup(['ds.bucketURL','ds.accessKeyId', 'ds.secretAccessKey'], function(newVals, oldVals) {
        if (newVals[0] !== oldVals[0] || newVals[1] !== oldVals[1] || newVals[2] !== oldVals[2]) {
        	if (newVals[0] !== undefined && newVals[1] !== undefined && newVals[2] !== undefined) {
        		//console.log("all values are defined");
    		}
    	}	
    }, false); 
   	$scope.sampleDataFromS3 = {
	    	"size_of_bucket": "0.740 GB",
	    	"sample_file_content": [
			        {
		            "screen": {
		                "name": "home"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:21.000-08:00",
		                "id": "click",
		                "value": "searchPhoto",
		                "name": "click"
		            }
		        },
		        {
		            "screen": {
		                "name": "searchPhoto"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:22.000-08:00",
		                "id": "search",
		                "value": "[search photo term]",
		                "name": "search"
		            }
		        },
		        {
		            "screen": {
		                "name": "photoList"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:24.000-08:00",
		                "id": "click",
		                "value": "home",
		                "name": "click"
		            }
		        },
		        {
		            "screen": {
		                "name": "home"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:25.000-08:00",
		                "id": "clickPhoto",
		                "value": "52681:1",
		                "name": "clickPhoto"
		            }
		        },
		        {
		            "screen": {
		                "name": "photoDetails"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:28.000-08:00",
		                "id": "click",
		                "value": "home",
		                "name": "click"
		            }
		        },
		        {
		            "screen": {
		                "name": "home"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:29.000-08:00",
		                "id": "click",
		                "value": "searchPhoto",
		                "name": "click"
		            }
		        },
		        {
		            "screen": {
		                "name": "searchPhoto"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:30.000-08:00",
		                "id": "search",
		                "value": "[search photo term]",
		                "name": "search"
		            }
		        },
		        {
		            "screen": {
		                "name": "photoList"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:32.000-08:00",
		                "id": "clickPhoto",
		                "value": "41880:1",
		                "name": "clickPhoto"
		            }
		        },
		        {
		            "screen": {
		                "name": "photoDetails"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:35.000-08:00",
		                "id": "click",
		                "value": "home",
		                "name": "click"
		            }
		        },
		        {
		            "screen": {
		                "name": "home"
		            },
		            "user-agent": {
		                "device": {
		                    "model": "iPhone",
		                    "version": "5s",
		                    "type": "phone",
		                    "osVersion": "ios7"
		                }
		            },
		            "session": {
		                "id": 0
		            },
		            "user": {
		                "firstName": "DIANA",
		                "lastName": "KENLEY",
		                "ageBand": "20-30",
		                "gender": "male",
		                "homeAddress": {
		                    "latitude": 37.284885,
		                    "longitude": -121.83454,
		                    "address": "10340 Sylvandale Avenue, "
		                },
		                "id": "43440"
		            },
		            "referral": {
		                "url": "Google play store",
		                "adGroup": "default",
		                "ad": "default",
		                "campaign": "default"
		            },
		            "event": {
		                "timestamp": "2014-01-01T00:01:36.000-08:00",
		                "id": "click",
		                "value": "camera",
		                "name": "click"
		            }
		        }
		    ],
		    "sample_file_name": "dt=2014-01-01/00.csv",
		    "folder_name": "dt=2014-01-01"
			};    
    
    //fetch sample data
    $scope.fetchSampleData = function(){
    	$scope.fetchingSampleText = "Fetching data, please wait...";
    	$scope.fetchingSample = true;
		$timeout(function(){
			$scope.sampleDataAsString = JSON.stringify($scope.sampleDataFromS3.sample_file_content);
			$scope.fetchingSampleText = "Fetch Sample Data From S3";
    		$scope.fetchingSample = false;
		}, 1000);
    	
    };

	//fetch sample data
    $scope.cancelFetchingSampleData = function(){
    	$scope.fetchingSampleText = "Fetch Sample Data From S3";
    	$scope.fetchingSample = false;
    }; 

    /************** entity mapping related **************************/
    $scope.entities = [];
    $scope.dataTypes = ['String', 'Number', 'Date', 'Boolean'];
	angular.forEach($scope.sampleDataFromS3.sample_file_content[0], function(attributes, entityName) {
	  var entity = {'entity': entityName, 'include': true, 'attributes': []};
	  angular.forEach(attributes, function(attributeValue, attribute){
	  	entity.attributes.push({'attribute': attribute, 'dataType': typeof attributeValue, 'sampleValues': attributeValue});
	  });
	  $scope.entities.push(entity);
	});

	$scope.setAttributeDataType = function(entityIndex, attributeIndex, type){
		//console.log(entityIndex + ':' + attributeIndex + type);
		$scope.entities[entityIndex].attributes[attributeIndex].dataType=type;
	};

	/************** metrics related **************************/
	$scope.oneMetricGroupAtATime = true;
	$scope.createNewMetric = function(entityIndex){
		$scope.entityMetrics[entityIndex].metrics.push({'name':'metric name', 'description': 'metric description',
    				'definition': 'define your metric and then hit validate to check', 'valid': false, 'period':'daily'});
	};
    $scope.entityMetrics = [
    	{'entity':'Session', 
			'metrics':[
    			{'name':'StartTime', 'description': 'Session start time',
    				'definition': 'First(Event).time', 'valid': true, 'period':'daily'}, 
    			
    			{'name':'EndTime', 'description': 'Session end time',
    				'definition': 'Last(Event).time', 'valid': true, 'period':'daily'},
    			
    			{'name':'Duration', 'description': 'Session duration',
    				'definition': 'EndTime - StartTime', 'valid': true, 'period':'daily'}, 
    			
    			{'name':'NumEvents', 'description': 'Number of events in the session',
    				'definition': 'Count(Events)', 'valid': true, 'period':'daily'},
    			
    			{'name':'NumScreens', 'description': 'Number of screens in the session',
    				'definition': 'CountDistinct(Event.Screen)', 'valid': true, 'period':'daily'},

    			{'name':'LandingScreen', 'description': 'First screen used by user for the session',
    				'definition': 'Last(Event).Screen', 'valid': true, 'period':'daily'}, 
    			
    			{'name':'ExitScreen', 'description': 'Last screen used by user for the session',
    				'definition': 'Last(Event).Screen', 'valid': true, 'period':'daily'},
    			
    			{'name':'FirstSession', 'description': 'First session of the day',
    				'definition': 'first(StartTime)', 'valid': true, 'period':'daily'}, 

    			{'name':'LastSession', 'description': 'Last session of the day',
    				'definition': 'last(EndTime)', 'valid': true, 'period':'daily'}, 
    			
    			{'name':'EventPath', 'description': 'Sequence of events depicting event journey in the session',
    				'definition': 'Gather({Event.Name, Event.Time})', 'valid': true, 'period':'daily'},
    			
    			{'name':'ScreenPath', 'description': 'Sequence of screens depicting screen journey in the session',
    				'definition': 'Gather(Distinct({Event.Screen, Screen.Duration}))', 'valid': true, 'period':'daily'},
    
    			{'name':'EventCountByName', 'description': 'Number of times each event was fired - event count', 'input' :['Name'],
    				'definition': 'Count(Event.Name = Name)', 'valid': true, 'period':'daily'},
    			
    			{'name':'ScreenCountByName', 'description': 'Number of times each screen was fired - screen count', 'input' :['Name'],
    				'definition': 'Count(distancesequence(Event.Screen).Name = Name)', 'valid': true, 'period':'daily'},

    			{'name':'ScreenDurationByScreen', 'description': 'Time Spent on each screen in the session', 'input' :['Name'],
    				'definition': 'sum(if Event.Screen.Name = Name then Event.NextEventTime - Event.Time else 0)', 'valid': true, 'period':'daily'}  		
    		]
    	},    	
    	{'entity':'User', 
			'metrics':[
    			{'name':'NumSessions', 'description': 'Count of number of daily sessions for a user',
    				'definition': 'NumSessions > 3', 'valid': true, 'period':'daily'}, 
    			{'name':'Spend', 'description': 'Amount spend per day for a user',
    				'definition': 'NumSessions > 3', 'valid': true, 'period':'daily'} 
    		]
    	},    	
    	{'entity':'Event', 
			'metrics':[
    			{'name':'PreviousEventTime', 'description': 'Timestap of previous event',
    				'definition': 'Event.Lag(1).Time', 'valid': true, 'period':'daily'}, 
    			{'name':'NextEventTime', 'description': 'Timestap of next event',
    				'definition': 'Event.Lead(1).Time', 'valid': true, 'period':'daily'}, 
    		]
    	},
    	{'entity':'User Segment', 
    		'metrics':[
    			{'name':'IsActive', 'description': 'A user is an active user on a particular day if he/she had more than 3 session.  The rule for across days is that User should be active for more than half the days of the period.', 
    				'definition': 'NumSessions > 3', 'valid': true, 'period':'daily'}, 
    			{'name':'HighlyActive', 'description': 'If user is in the first tile in terms of NumSessions. Across Days a User is HighlyActive if they are highly active for 1/3rd the time.',
    				'definition': 'NumSessions.ntile = 1', 'valid': true, 'period':'daily'}, 
    			{'name':'IsPaying', 'description': 'A user is a paying user on a particular day if he/she bought more than $5 worth of merchandise.  The rule for across days (user is active over a period) is that user should have at least one paying event.', 
    				'definition': 'Sum(Session.TransactionEvent.Amount) > 5', 'valid': true, 'period':'daily'}, 
    			{'name':'PayingEventsCount', 'description': 'Count number of paying events per day',
    				'definition': 'Count(Session.TransactionEvent)', 'valid': true, 'period':'daily'}, 
    			{'name':'AdGroupSessionCount', 'description': 'Count of number of Sessions on a Day that were initiated based on the the AdGroupType',
    				'definition': 'Count(Session.Campaign.AdGroup = `AdGroupType`)', 
    				'input' :['AdGroupType'],'valid': true, 'period':'daily'},
				{'name':'RecenyScore', 'description': 'A score based on recent interaction of a user.',
    				'definition': '100 * (1 - 1/(NumSessions))', 
    				'valid': true, 'period':'daily'},    				
				{'name':'FrequencyScore', 'description': 'A score measuring the strength of a user engagement.',
    				'definition': '100 * ( 1 - 1/Sum(IsActive))', 
    				'valid': true, 'period':'daily'}
    		]
    	}     	
    ];
	/******************* design analysis related *****************************/

	$scope.analysisTemplates = [
		{'type': 'Goal Analysis', 'description': 'Track outcomes and metrics relating to the outcome. Example: for an online or mobile commerce company, purchases are goals. Goal Analysis will automatically surface all drivers of the goal, the changes in the metrics related to the goal and possible “Actions” to be taken to change the goal behavior.', 'icon': 'fa-bullseye','available':true},	
		{'type': 'Customer Journey', 'description': 'See how customers navigate across your site and app. For each segment of users see what leads to them between various Impact content and the probability of a segment moving closer to your outcome. This can form the basis of your retargeting efforts. ', 'icon': 'fa-random' , 'available':true},
		{'type': 'Attribution Analysis', 'description': 'Don’t settle for last click attribution. All you campaigns have roles - some create awareness, some keep your audience engaged and some close the deal but all are important. Use what-if scenarios to change campaign budget allocation and predict LTV impact.', 'icon': 'fa-pie-chart', 'available':true},
		{'type': 'Retention by Cohorts', 'description': 'Track your user engagement by Cohorts. See if your campaigns are “Leaky” - Lots of users but not many come back. This can be a problem with your campaign allocation.' , 'icon': 'fa-users', 'available':true},
		{'type': 'Campaign Analysis', 'description': 'Track all your online and offline campaigns and their impact on your audience. Find out the ROI on your campaigns my mapping spend to user LTV.', 'icon': 'fa-newspaper-o', 'available':false},		
		{'type': 'RFM ( Recency, Frequency, Monetary) Analysis. ', 'description': 'Track your customer success by modeling user behavior from first contact to now. Use recency, frequency and monetary metrics( LTV) to see which segments are producing the best ROI by metric.' , 'icon': 'fa-cubes', 'available':false},
		{'type': 'DropOff Analysis ( Funnels)', 'description': 'Track the user journey on your app or website by tracking drop off rates at various points along the customer journey.' , 'icon': 'fa-filter', 'available':false },
		{'type': 'Content Analysis ( Impact to Outcome)', 'description': 'The purpose of your app or site and any content is to make an impact on the eventual outcome( Purchase, renew subscription etc). So its natural you should be tracking the Impact score of the critical content pieces.', 'icon': 'fa-puzzle-piece', 'available':false}
	];
	$scope.analysisTemplate = null;
	$scope.analysisTemplate = $location.search().analysisTemplate;
  	if($scope.analysisTemplate === undefined){
  		$scope.analysisTemplate = null;
  	} else {
  		$scope.analysisTemplate = parseInt($scope.analysisTemplate);
  	} 	
	$scope.launchTemplate = function(templateIndex){
		$scope.analysisTemplate = templateIndex;
    	$location.search('analysisTemplate', $scope.analysisTemplate);
	};
	/********* goal analysis related ************/
	$scope.goalEvents = ["Purchase", "Add to Cart"]
	$scope.lookbackPeriods = ['1 week', '2 weeks', '3 weeks', '4 weeks'];

	$scope.impactEvents = ['Video Laser 4x', 'Why Laser 4x', 'Easy to Use Video 4x', 'Reviews', '90-day Money Back', 
		'Skin Care', 'Free Shipping', 'Warranty'];
	
	$scope.impactEventsWithIds = [];
	angular.forEach($scope.impactEvents, function(value, key){
		$scope.impactEventsWithIds.push({'id': key, 'label': value});
	});

	$scope.distanceMetrics = ['Number of Sessions', 'Time On Site', 'Clock Time', 'Number of Impacts Since'];
	$scope.savedGoalAnalysis = [ {'name': 'Purchase Event Analysis (1 week)', 'model':
		{"goalEvent":"Purchase",
		"impactEvents":["Video Laser 4x","Why Laser 4x","Easy to Use Video 4x","Reviews","90-day Money Back","Skin Care","Free Shipping","Warranty"],
		"trackMetrics":["Number of Sessions","Clock Time","Time On Site","Number of Impacts Since"],
		"lookbackPeriod":"2 weeks"
		}}, 
		{'name': 'Add to Cart Event Analysis (2 week)', 'model':
		{"goalEvent":"Add to Cart",
		"impactEvents":["Video Laser 4x","Why Laser 4x","Easy to Use Video 4x","Reviews","90-day Money Back","Skin Care","Free Shipping","Warranty"],
		"trackMetrics":["Number of Sessions","Clock Time","Time On Site","Number of Impacts Since"],
		"lookbackPeriod":"2 weeks"
		}}];
	
	$scope.currentGoalAnalysis = {
		'goalEvent': 'Goal Events', 
		'impactEvents': [],
		'trackMetrics':[], 
		'lookbackPeriod': 'Lookback Period'
	};
	$scope.currentSelectedImpactEventIds = [];
	
	$scope.setCurrentGoalEvent = function(goalEvent){
		$scope.currentGoalAnalysis.goalEvent = goalEvent;
	};

	$scope.setCurrentGoalMetric = function(metric) {
		$scope.currentGoalAnalysis.trackMetrics.push(metric);
	};

	$scope.setLookbackPeriod = function(period) {
		$scope.currentGoalAnalysis.lookbackPeriod = period;
	};

	$scope.startNewGoalAnalysis = function(){
		$scope.currentGoalAnalysis = {'goalEvent': 'Goal Event', 'impactEvents': [], 'trackMetrics':[],
		'lookbackPeriod': 'Lookback Period'};
	};

	$scope.saveCurrentGoalAnalysis = function(){
		$scope.savedGoalAnalysis.push({'name': 'Goal Model-' + $scope.savedGoalAnalysis.length, 
			'model': $scope.currentGoalAnalysis});
	};

	$scope.saveCurrentGoalAndStartNewAnalysis = function(){
		$scope.savedGoalAnalysis.push({'name': 'Goal Model-' + $scope.savedGoalAnalysis.length, 
			'model': $scope.currentGoalAnalysis});
		$scope.currentGoalAnalysis = {
			'goalEvent': 'Goal Events', 
			'impactEvents': [],
			'trackMetrics':[], 
			'lookbackPeriod': 'Lookback Period'
		};		
	};

	$scope.resetCurrentGoalAnalysis = function(){
		$scope.currentGoalAnalysis = {
			'goalEvent': 'Goal Events', 
			'impactEvents': [],
			'trackMetrics':[], 
			'lookbackPeriod': 'Lookback Period'
		};
	};

	$scope.removeGoalAnalysisModel = function(index){
		$scope.savedGoalAnalysis.splice(index, 1);
	};

	$scope.useGoalAnalysisModel = function(index){
		console.log(index);
		$scope.currentGoalAnalysis = $scope.savedGoalAnalysis[index].model;
	};


	/************************ multi-select for impact events ************************/

	$scope.eventsText = {buttonDefaultText: 'All impact events'};

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
		var _event = $filter('filter')($scope.impactEventsWithIds, {id:item.id}, true);	
		if(_event.length > 0) {
			eventName =  _event[0]['label'];
			var i = $scope.currentGoalAnalysis.impactEvents.indexOf(eventName);
			if(i == -1) {
				$scope.currentGoalAnalysis.impactEvents.splice(i, 1);
			}
		}
	};


	// fired event when an item is selected
	$scope.eventSelected = function(item){
		console.log(item);
		var eventName = null;
		var _event = $filter('filter')($scope.impactEventsWithIds, {id:item.id}, true);	
		if(_event.length > 0) {
			eventName =  _event[0]['label'];
			var i = $scope.currentGoalAnalysis.impactEvents.indexOf(eventName);
			if(i == -1) {
				$scope.currentGoalAnalysis.impactEvents.push(eventName);
			}
		}	
	};
	// fired event when all items are selected
	$scope.allEventsSelected = function(){
		$scope.currentGoalAnalysis.impactEvents = [];
		angular.forEach($scope.impactEventsWithIds, function(_event) {
			$scope.currentGoalAnalysis.impactEvents.push(_event.label);
			$scope.currentSelectedImpactEventIds.push({"id":_event.id})
		});			
	};

	// fired event when all items are deselected
	$scope.allEventsUnselected = function(){
		$scope.currentGoalAnalysis.impactEvents = [];	
		$scope.currentSelectedImpactEventIds = [];
	};

	/**** Final Step - cluseter, cloud and launch *****/
	$scope.dataModel = {
	  'graph': [],
	  'links': [
	    {'source': 0, 'target': 1},
	    {'source': 1, 'target': 2},
	    {'source': 1, 'target': 3},
	    {'source': 3, 'target': 4},
	    {'source': 3, 'target': 5},
	    {'source': 1, 'target': 6}],
	  'nodes': [
	    {'size': 100, 'score': 0, 'id': 'Users', 'type': 'square'},
	    {'size': 100, 'score': 0.2, 'id': 'Sessions', 'type': 'square'},
	    {'size': 100, 'score': 0.6, 'id': 'Campaigns', 'type': 'square'},
	    {'size': 100, 'score': 0.4, 'id': 'Events', 'type': 'square'},
	    {'size': 100, 'score': 0.8, 'id': 'Time', 'type': 'square'},
	    {'size': 100, 'score': 1, 'id': 'Screens', 'type': 'square'},
	    {'size': 100, 'score': 1, 'id': 'User-Agent', 'type': 'square'}
	    ],
	  'directed': false,
	  'multigraph': false
	}
	$scope.selectedCloudLocation = 'Choose Cloud Location';
	$scope.cloudLocations = ['AWS', 'Databricks'];
	$scope.setCloudLocation = function(cloudLocation){
		$scope.selectedCloudLocation = cloudLocation;
	};
	$scope.secretAccessKey = 'unTfzEA33cY5AXK4+JqFZdBXEBqH+XenHURADlkr';
	$scope.accessKeyId = 'AKIAIOVG3I235W5NVR4A';


  });
	

