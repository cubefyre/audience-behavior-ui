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
 * @ngdoc filter
 * @name sparkyApp.filter:DateFilter
 * @function
 * @description
 * # DateFilter
 * Filter in the sparkyApp.
 * Credit - http://angulartutorial.blogspot.in/2014/04/date-filtering-and-formatting-in.html
 */
angular.module('sparkyApp')
  .filter('DateFilter', function ($filter) {
	return function(input)
    {
        if(input == null){ return ""; }
        var d = $filter('date')(new Date().setTime(input), 'MMM dd');
        return d.toUpperCase();
    };
  });
