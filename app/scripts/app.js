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
 * @ngdoc overview
 * @name sparkyApp
 * @description
 *
 * Main module of the application.
 */
var d3Module = angular.module('d3', [])
.factory('d3Service', function($document, $q, $window, $rootScope) {
    var d = $q.defer(),
        d3service = {
          d3: function() { return d.promise; }
        };
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve($window.d3); });
    }
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript'; 
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    //scriptTag.src = 'bower_components/d3/d3.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState == 'complete') onScriptLoad();
    }
    scriptTag.onload = onScriptLoad;
   
    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
   
    return d3service;
  });


angular
  .module('sparkyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'daterangepicker',
    'nvd3ChartDirectives',
    'angularjs-dropdown-multiselect',
    'ui.select',
    'ngDragDrop',
    'highcharts-ng',
    'ui.grid',
    'ui.grid.pinning',
    'ui.grid.selection',
    'ui.grid.exporter',
    'd3',
    'xeditable'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/funnels', {
        templateUrl: 'views/funnels.html',
        controller: 'FunnelsCtrl',
        resolve: {
          funnelList: function(FunnelService) {
            return FunnelService.loadFunnelsList();
          },
          funnelData: function(FunnelService){
            return FunnelService.loadDefaultFunnel();
          }          
        }
      })
      .when('/segmentation', {
        templateUrl: 'views/segmentation.html',
        controller: 'SegmentationCtrl',
        resolve: {
          events: function(EventService) {
            return EventService.loadEvents();
          },
          eventsData: function(EventService){
            return EventService.loadEventsData();
          }
        }        
      })
      .when('/cohort', {
        templateUrl: 'views/cohort.html',
        controller: 'CohortCtrl',
        resolve: {
          events: function(EventService) {
            return EventService.loadEvents();
          },
          eventsData: function(EventService){
            return EventService.loadEventsData();
          }
        }        
      })
      .when('/trend', {
        templateUrl: 'views/trend.html',
        controller: 'TrendCtrl',
        resolve: {
          events: function(EventService) {
            return EventService.loadEvents();
          },
          eventsData: function(EventService){
            return EventService.loadEventsData();
          }
        }
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        onStep: 0
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signout', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        action: "signout"
      })      
      .when('/impact', {
        templateUrl: 'views/goal.html',
        controller: 'GoalCtrl'
      })
      .when('/path', {
        templateUrl: 'views/path.html',
        controller: 'PathCtrl'
      })
      .when('/integration', {
        templateUrl: 'views/integration.html',
        controller: 'IntegrationCtrl'
      })      
      .when('/attribution', {
        templateUrl: 'views/attribution.html',
        controller: 'AttributionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, $window, $location, $http, editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      $window.sessionStorage.token = 'bla';
      // check is user is logged in
      /* if(typeof $window.sessionStorage.token === 'undefined'){
        console.log('user not logged in');
        $location.path("/login");
      }*/
      //$http.defaults.headers.common.Authorization = $window.sessionStorage.token;
      $rootScope.$on('$routeChangeStart', function(e, curr, prev) { 
        // check is user is logged in
        /*if(typeof $window.sessionStorage.token === 'undefined'){
          console.log('user not logged in');
          $location.path("/login");
        }      
        if (curr.$$route && curr.$$route.resolve) {
          // Show a loading message until promises are not resolved
          $rootScope.loadingView = true;
        }*/
      });

      $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) { 
        // Hide loading message
        $rootScope.loadingView = false;
      });

      //app util functions
      $rootScope.UTIL = {
      toFilename: function(filename) {
        return filename
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^w-]+/g,'');
      },
      fromFilename: function(filename) {
      return filename
          .toLowerCase()
          .replace(/[^w ]+/g,'')
          .replace(/ +/g,'-');
      }
      //etc more functions here...
    };
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  })
  .constant('AUTH_EVENTS', { //constants
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .value('SERVER_SETTINGS', { //values for production
    url: { 
      events: {
        data: '/app/events/data',
        list: '/app/events/'
      },
      funnels: {
        data: '/app/funnels/data',
        list: '/app/funnels/'
      },
      segmentation: {
        data: '/app/segmentation/data',
        list: '/app/segmentation/'
      },
      retention: {
        data: '/app/retention/data',
        list: '/app/retention/'
      },  
      filters :{
        list: '/app/filters/'
      },
      user: {
        signin: '/app/user/signin'
      }
    }
  })
/*.value('SERVER_SETTINGS', { //values for local
    url: { 
      events: {
        data: 'http://localhost:19980/events/data',
        list: 'http://localhost:19980/events/'
      },
      funnels: {
        data: 'http://localhost:19980/funnels/data',
        list: 'http://localhost:19980/funnels/'
      },
      segmentation: {
        data: 'http://localhost:19980/segmentation/data',
        list: 'http://localhost:19980/segmentation/'
      },
      retention: {
        data: 'http://localhost:19980/retention/data',
        list: 'http://localhost:19980/retention/'
      },      
      filters :{
        list: 'http://localhost:19980/filters/'
      },
      user: {
        signin: 'http://localhost:19980/user/signin'
      }
    }
  })*/
  .directive('d3path', 
    function($window, $timeout, d3Service) {
    return {
      restrict: 'AE',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
 
          var renderTimeout;
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;
 
          /*var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');
 
          $window.onresize = function() {
            scope.$apply();
          };
 
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });*/
 
          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true);
 
          scope.render = function(data) {
            //svg.selectAll('*').remove();
 
            if (!data) return;
            if (renderTimeout) clearTimeout(renderTimeout);
            // regular d3 code here
            renderTimeout = $timeout(function() {
                // Dimensions of sunburst.
                var width = 750;
                var height = 600;
                var radius = Math.min(width, height) / 2;

                // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
                var b = {
                  w: 75, h: 30, s: 3, t: 10
                };

                // Mapping of step names to colors.
                var colors = {
                  "home": "#5687d1",
                  "product": "#7b615c",
                  "search": "#de783b",
                  "account": "#6ab975",
                  "other": "#a173d1",
                  "end": "#bbbbbb"
                };

                // Total size of all segments; we set this later, after loading the data.
                var totalSize = 0; 

                var vis = d3.select("#chart").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("svg:g")
                    .attr("id", "container")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var partition = d3.layout.partition()
                    .size([2 * Math.PI, radius * radius])
                    .value(function(d) { return d.size; });

                var arc = d3.svg.arc()
                    .startAngle(function(d) { return d.x; })
                    .endAngle(function(d) { return d.x + d.dx; })
                    .innerRadius(function(d) { return Math.sqrt(d.y); })
                    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

                // Use d3.text and d3.csv.parseRows so that we do not need to have a header
                // row, and can receive the csv as an array of arrays.
                d3.text("/data/visit-sequences.csv", function(text) {
                  var csv = d3.csv.parseRows(text);
                  var json = buildHierarchy(csv);
                  //console.log(json);
                  createVisualization(json);
                });

                // Main function to draw and set up the visualization, once we have the data.
                function createVisualization(json) {

                  // Basic setup of page elements.
                  initializeBreadcrumbTrail();
                  drawLegend();
                  d3.select("#togglelegend").on("click", toggleLegend);

                  // Bounding circle underneath the sunburst, to make it easier to detect
                  // when the mouse leaves the parent g.
                  vis.append("svg:circle")
                      .attr("r", radius)
                      .style("opacity", 0);

                  // For efficiency, filter nodes to keep only those large enough to see.
                  var nodes = partition.nodes(json)
                      .filter(function(d) {
                      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
                      });

                  var path = vis.data([json]).selectAll("path")
                      .data(nodes)
                      .enter().append("svg:path")
                      .attr("display", function(d) { return d.depth ? null : "none"; })
                      .attr("d", arc)
                      .attr("fill-rule", "evenodd")
                      .style("fill", function(d) { return colors[d.name]; })
                      .style("opacity", 1)
                      .on("mouseover", mouseover);

                  // Add the mouseleave handler to the bounding circle.
                  // tempo commented to leave the last path selected
                  //d3.select("#container").on("mouseleave", mouseleave);
                  
                  // Get total size of the tree = value of root node from partition.
                  totalSize = path.node().__data__.value;
                  
                  //following code slects the first path which has depth of 6
                  for (var i = 0; i < path[0].length; i++){
                    if(path[0][i].__data__.depth == 6){
                      mouseover(path[0][i].__data__);
                      break;
                    }
                  }

                 };

                // Fade all but the current sequence, and show it in the breadcrumb trail.
                function mouseover(d) { 
                  var percentage = (100 * d.value / totalSize).toPrecision(3);
                  var percentageString = percentage + "%";
                  if (percentage < 0.1) {
                    percentageString = "< 0.1%";
                  }

                  d3.select("#percentage")
                      .text(percentageString);

                  d3.select("#explanation")
                      .style("visibility", "");

                  var sequenceArray = getAncestors(d);
                  updateBreadcrumbs(sequenceArray, percentageString);

                  // Fade all the segments.
                  d3.selectAll("path")
                      .style("opacity", 0.3);

                  // Then highlight only those that are an ancestor of the current segment.
                  vis.selectAll("path")
                      .filter(function(node) {
                                return (sequenceArray.indexOf(node) >= 0);
                              })
                      .style("opacity", 1);
                }

                // Restore everything to full opacity when moving off the visualization.
                function mouseleave(d) {

                  // Hide the breadcrumb trail
                  d3.select("#trail")
                      .style("visibility", "hidden");

                  // Deactivate all segments during transition.
                  d3.selectAll("path").on("mouseover", null);

                  // Transition each segment to full opacity and then reactivate it.
                  d3.selectAll("path")
                      .transition()
                      .duration(1000)
                      .style("opacity", 1)
                      .each("end", function() {
                              d3.select(this).on("mouseover", mouseover);
                            });

                  d3.select("#explanation")
                      .style("visibility", "hidden");
                }

                // Given a node in a partition layout, return an array of all of its ancestor
                // nodes, highest first, but excluding the root.
                function getAncestors(node) {
                  var path = [];
                  var current = node;
                  while (current.parent) {
                    path.unshift(current);
                    current = current.parent;
                  }
                  return path;
                }

                function initializeBreadcrumbTrail() {
                  // Add the svg area.
                  var trail = d3.select("#sequence").append("svg:svg")
                      .attr("width", width)
                      .attr("height", 50)
                      .attr("id", "trail");
                  // Add the label at the end, for the percentage.
                  trail.append("svg:text")
                    .attr("id", "endlabel")
                    .style("fill", "#000");
                }

                // Generate a string that describes the points of a breadcrumb polygon.
                function breadcrumbPoints(d, i) {
                  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.                 
                  var points = [];
                  points.push("0,0");
                  points.push(b.w + ",0");
                  points.push(b.w + b.t + "," + (b.h / 2));
                  points.push(b.w + "," + b.h);
                  points.push("0," + b.h);
                  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                    points.push(b.t + "," + (b.h / 2));
                  }
                  return points.join(" ");
                }

                // Update the breadcrumb trail to show the current sequence and percentage.
                function updateBreadcrumbs(nodeArray, percentageString) {

                  // Data join; key function combines name and depth (= position in sequence).
                  var g = d3.select("#trail")
                      .selectAll("g")
                      .data(nodeArray, function(d) { return d.name + d.depth; });

                  // Add breadcrumb and label for entering nodes.
                  var entering = g.enter().append("svg:g");

                  entering.append("svg:polygon")
                      .attr("points", breadcrumbPoints)
                      .style("fill", function(d) { return colors[d.name]; });

                  entering.append("svg:text")
                      .attr("x", (b.w + b.t) / 2)
                      .attr("y", b.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(function(d) { return d.name; });

                  // Set position for entering and updating nodes.
                  g.attr("transform", function(d, i) {
                    return "translate(" + i * (b.w + b.s) + ", 0)";
                  });

                  // Remove exiting nodes.
                  g.exit().remove();

                  // Now move and update the percentage at the end.
                  d3.select("#trail").select("#endlabel")
                      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
                      .attr("y", b.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(percentageString);

                  // Make the breadcrumb trail visible, if it's hidden.
                  d3.select("#trail")
                      .style("visibility", "");

                }

                function drawLegend() {

                  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
                  var li = {
                    w: 75, h: 30, s: 3, r: 3
                  };

                  var legend = d3.select("#legend").append("svg:svg")
                      .attr("width", li.w)
                      .attr("height", d3.keys(colors).length * (li.h + li.s));
                      //.attr("transform", "translate(" + 10 + "," + 50 + ")");

                  var g = legend.selectAll("g")
                      .data(d3.entries(colors))
                      .enter().append("svg:g")
                      .attr("transform", function(d, i) {
                              return "translate(30," + (150 + i * (li.h + li.s)) + ")"; // vertical layout, shifting down 150
                              //return "translate(" + i * (li.w + li.s) + ",0)"; // uncomment for horizontal layout
                           });

                  g.append("svg:rect")
                      .attr("rx", li.r)
                      .attr("ry", li.r)
                      .attr("width", li.w)
                      .attr("height", li.h)
                      .style("fill", function(d) { return d.value; });

                  g.append("svg:text")
                      .attr("x", li.w / 2)
                      .attr("y", li.h / 2)
                      .attr("dy", "0.35em")
                      .attr("text-anchor", "middle")
                      .text(function(d) { return d.key; });
                }

                function toggleLegend() {
                  var legend = d3.select("#legend");
                  if (legend.style("visibility") == "hidden") {
                    legend.style("visibility", "");
                  } else {
                    legend.style("visibility", "hidden");
                  }
                }

                // Take a 2-column CSV and transform it into a hierarchical structure suitable
                // for a partition layout. The first column is a sequence of step names, from
                // root to leaf, separated by hyphens. The second column is a count of how 
                // often that sequence occurred.
                function buildHierarchy(csv) {
                  var root = {"name": "root", "children": []};
                  for (var i = 0; i < csv.length; i++) {
                    var sequence = csv[i][0];
                    var size = +csv[i][1];
                    if (isNaN(size)) { // e.g. if this is a header row
                      continue;
                    }
                    var parts = sequence.split("-");
                    var currentNode = root;
                    for (var j = 0; j < parts.length; j++) {
                      var children = currentNode["children"];
                      var nodeName = parts[j];
                      var childNode;
                      if (j + 1 < parts.length) {
                   // Not yet at the end of the sequence; move down the tree.
                  var foundChild = false;
                  for (var k = 0; k < children.length; k++) {
                    if (children[k]["name"] == nodeName) {
                      childNode = children[k];
                      foundChild = true;
                      break;
                    }
                  }
                  // If we don't already have a child node for this branch, create it.
                  if (!foundChild) {
                    childNode = {"name": nodeName, "children": []};
                    children.push(childNode);
                  }
                  currentNode = childNode;
                      } else {
                  // Reached the end of the sequence; create a leaf node.
                  childNode = {"name": nodeName, "size": size};
                  children.push(childNode);
                      }
                    }
                  }
                  return root;
                };
            }, 200);
          };
        });
      }}
  })
  .directive('d3datamodel', 
    function($timeout, d3Service) {
    return {
      restrict: 'AE',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          
          var renderTimeout; 
          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true)
          console.log(ele[0]);
          scope.render = function(data) {    
            var modelGraph = d3.select(ele[0])
              .append('svg:svg')
              .style('width', '100%');
              var h = 400;
            /*var w = d3.select(ele[0]).innerWidth;
            
            console.log(w);*/
            modelGraph.selectAll('*').remove();            
              
              if (!data) return;

              if (renderTimeout) clearTimeout(renderTimeout);
              
              // regular d3 code here
              renderTimeout = $timeout(function() {
                  
                  modelGraph.attr('height', h)
                  .attr('id', "model");
                  
                  // Mapping of step names to colors.
                  var colors = ['#5687d1', '#7b615c', '#de783b', '#6ab975', '#a173d1', '#bbbbbb'];
                  var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true

                  var focus_node = null, highlight_node = null;

                  var text_center = false;
                  var outline = false;

                  var min_score = 0;
                  var max_score = 1;

                  var color = d3.scale.linear()
                    .domain([min_score, (min_score+max_score)/2, max_score])
                    .range(['#5687d1', '#7b615c', '#de783b', '#6ab975', '#a173d1', '#bbbbbb']);
                  console.log(color);

                  var highlight_color = "blue";
                  var highlight_trans = 0.1;
                    
                  var size = d3.scale.pow().exponent(1)
                    .domain([1,100])
                    .range([8,24]);
                    
                  var force = d3.layout.force()
                    .linkDistance(200)
                    .charge(-400)
                    .size([100,100]);

                  var default_node_color = "#ccc";
                  //var default_node_color = "rgb(3,190,100)";
                  var default_link_color = "#888";
                  var nominal_base_node_size = 8;
                  var nominal_text_size = 18;
                  var max_text_size = 24;
                  var nominal_stroke = 1.5;
                  var max_stroke = 4.5;
                  var max_base_node_size = 36;
                  var min_zoom = 0.1;
                  var max_zoom = 7;
                  
                  var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
                  var g = modelGraph.append("g");
                  console.log(g);
                  modelGraph.style("cursor","move");

                  d3.json("/data/model.json", function(error, graph) {
                    //console.log(graph);
                  var linkedByIndex = {};
                      graph.links.forEach(function(d) {
                    linkedByIndex[d.source + "," + d.target] = true;
                      });

                    function isConnected(a, b) {
                          return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
                      }

                    function hasConnections(a) {
                      for (var property in linkedByIndex) {
                          s = property.split(",");
                          if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])          return true;
                      }
                    return false;
                    }
                    
                    force
                      .nodes(graph.nodes)
                      .links(graph.links)
                      .start();

                    var link = g.selectAll(".link")
                      .data(graph.links)
                      .enter().append("line")
                      .attr("class", "link")
                    .style("stroke-width",nominal_stroke)
                    .style("stroke", function(d) { 
                    if (isNumber(d.score) && d.score>=0) return color(d.score);
                    else return default_link_color; })
                    
                    var drag = force.drag().on("dragstart", dragstart);

                    var node = g.selectAll(".node")
                      .data(graph.nodes)
                      .enter().append("g")
                      .attr("class", "node")
                      .call(drag);
                      //.call(force.drag);

                    
                    node.on("dblclick.zoom", function(d) { d3.event.stopPropagation();
                    var dcx = (window.innerWidth/2-d.x*zoom.scale());
                    var dcy = (window.innerHeight/2-d.y*zoom.scale());
                    zoom.translate([dcx,dcy]);
                     g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
                     
                     
                    });
                    
                    var tocolor = "fill";
                    var towhite = "stroke";
                    if (outline) {
                      tocolor = "stroke"
                      towhite = "fill"
                    }
                    
                    var circle = node.append("path")
                        .attr("d", d3.svg.symbol()
                          .size(function(d) { return Math.PI*Math.pow(size(d.size)||nominal_base_node_size,2); })
                          .type(function(d) { return d.type; }))
                    
                    .style(tocolor, function(d) { 
                    if (isNumber(d.score) && d.score>=0) return color(d.score);
                    else return default_node_color; })
                      //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
                    .style("stroke-width", nominal_stroke)
                    .style(towhite, "white");
                      
                  
                    var text = g.selectAll(".text")
                      .data(graph.nodes)
                      .enter().append("text")
                      .attr("dy", ".35em")
                    .style("font-size", nominal_text_size + "px")

                    if (text_center)
                     text.text(function(d) { return d.id; })
                    .style("text-anchor", "middle");
                    else 
                    text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
                      .text(function(d) { return '\u2002'+d.id; });

                    node.on("mouseover", function(d) {
                    set_highlight(d);
                    })
                    .on("mousedown", function(d) { d3.event.stopPropagation();
                      focus_node = d;
                    set_focus(d)
                    if (highlight_node === null) set_highlight(d)
                    
                  } ).on("mouseout", function(d) {
                      exit_highlight();

                  } );

                      d3.select(window).on("mouseup",  
                      function() {
                      if (focus_node!==null)
                      {
                        focus_node = null;
                        if (highlight_trans<1)
                        {
                    
                      circle.style("opacity", 1);
                      text.style("opacity", 1);
                      link.style("opacity", 1);
                    }
                      }
                    
                    if (highlight_node === null) exit_highlight();
                      });

                  function dragstart(d) {
                    d3.select(this).classed("fixed", d.fixed = true);
                  }

                  function exit_highlight()
                  {
                      highlight_node = null;
                    if (focus_node===null)
                    {
                      modelGraph.style("cursor","move");
                      if (highlight_color!="white")
                    {
                        circle.style(towhite, "white");
                      text.style("font-weight", "normal");
                      link.style("stroke", function(o) {return (isNumber(o.score) && o.score>=0)?color(o.score):default_link_color});
                   }
                        
                    }
                  }

                  function set_focus(d)
                  { 
                  if (highlight_trans<1)  {
                      circle.style("opacity", function(o) {
                                  return isConnected(d, o) ? 1 : highlight_trans;
                              });

                        text.style("opacity", function(o) {
                                  return isConnected(d, o) ? 1 : highlight_trans;
                              });
                        
                              link.style("opacity", function(o) {
                                  return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                              });   
                    }
                  }


                  function set_highlight(d)
                  {
                    modelGraph.style("cursor","pointer");
                    if (focus_node!==null) d = focus_node;
                    highlight_node = d;

                    if (highlight_color!="white")
                    {
                        circle.style(towhite, function(o) {
                                  return isConnected(d, o) ? highlight_color : "white";});
                        text.style("font-weight", function(o) {
                                  return isConnected(d, o) ? "bold" : "normal";});
                              link.style("stroke", function(o) {
                            return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);

                              });
                    }
                  }
                    
                    
                    zoom.on("zoom", function() {
                    
                      var stroke = nominal_stroke;
                      if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
                      link.style("stroke-width",stroke);
                      circle.style("stroke-width",stroke);
                       
                    var base_radius = nominal_base_node_size;
                      if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
                          circle.attr("d", d3.svg.symbol()
                          .size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
                          .type(function(d) { return d.type; }))
                      
                    //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
                    if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });
                    
                    var text_size = nominal_text_size;
                      if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
                      text.style("font-size",text_size + "px");

                    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    });
                     
                    modelGraph.call(zoom);   
                    
                    resize();
                    //window.focus();
                    d3.select(window).on("resize", resize).on("keydown", keydown);
                      
                    force.on("tick", function() {
                      
                      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                      text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    
                      link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                      
                      node.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                    });
                    
                    function resize() {
                      var width = window.innerWidth, height = window.innerHeight;
                    modelGraph.attr("width", width).attr("height", height);
                      
                    force.size([force.size()[0]+(width-500)/zoom.scale(),force.size()[1]+(height-300)/zoom.scale()]).resume();
                      var w = width;
                      var h = height;
                    }
                    
                    function keydown() {
                    if (d3.event.keyCode==32) {  force.stop();}
                    else if (d3.event.keyCode>=48 && d3.event.keyCode<=90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey)
                    {
                    switch (String.fromCharCode(d3.event.keyCode)) {
                      case "C": keyc = !keyc; break;
                      case "S": keys = !keys; break;
                    case "T": keyt = !keyt; break;
                    case "R": keyr = !keyr; break;
                      case "X": keyx = !keyx; break;
                    case "D": keyd = !keyd; break;
                    case "L": keyl = !keyl; break;
                    case "M": keym = !keym; break;
                    case "H": keyh = !keyh; break;
                    case "1": key1 = !key1; break;
                    case "2": key2 = !key2; break;
                    case "3": key3 = !key3; break;
                    case "0": key0 = !key0; break;
                    }
                      
                    link.style("display", function(d) {
                          var flag  = vis_by_type(d.source.type)&&vis_by_type(d.target.type)&&vis_by_node_score(d.source.score)&&vis_by_node_score(d.target.score)&&vis_by_link_score(d.score);
                          linkedByIndex[d.source.index + "," + d.target.index] = flag;
                                return flag?"inline":"none";});
                    node.style("display", function(d) {
                          return (key0||hasConnections(d))&&vis_by_type(d.type)&&vis_by_node_score(d.score)?"inline":"none";});
                    text.style("display", function(d) {
                                  return (key0||hasConnections(d))&&vis_by_type(d.type)&&vis_by_node_score(d.score)?"inline":"none";});
                          
                          if (highlight_node !== null)
                          {
                            if ((key0||hasConnections(highlight_node))&&vis_by_type(highlight_node.type)&&vis_by_node_score(highlight_node.score)) { 
                            if (focus_node!==null) set_focus(focus_node);
                            set_highlight(highlight_node);
                            }
                            else {exit_highlight();}
                          }

                  } 
                  }
                   
                  });

                  function vis_by_type(type)
                  {
                    switch (type) {
                      case "circle": return keyc;
                      case "square": return keys;
                      case "triangle-up": return keyt;
                      case "diamond": return keyr;
                      case "cross": return keyx;
                      case "triangle-down": return keyd;
                      default: return true;
                  }
                  }
                  function vis_by_node_score(score)
                  {
                    if (isNumber(score))
                    {
                    if (score>=0.666) return keyh;
                    else if (score>=0.333) return keym;
                    else if (score>=0) return keyl;
                    }
                    return true;
                  }

                  function vis_by_link_score(score)
                  {
                    if (isNumber(score))
                    {
                    if (score>=0.666) return key3;
                    else if (score>=0.333) return key2;
                    else if (score>=0) return key1;
                  }
                    return true;
                  }

                  function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                  }



                  }, 200);//timeout stops here
            };
        });
      }}
  })
  .directive('d3breadcrumbs', 
    function($timeout, d3Service) {
    return {
      restrict: 'AE',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          
          var renderTimeout; 
          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true)
 
          scope.render = function(data) {    
            var pathId = 'path-'+ data.rank;
            var pathLabelId = 'path-'+ data.rank + '-label';
            var trail = d3.select(ele[0])
              .append('svg:svg')
              .style('width', '100%');

            trail.selectAll('*').remove();            
              
              if (!data) return;

              if (renderTimeout) clearTimeout(renderTimeout);
              
              // regular d3 code here
              renderTimeout = $timeout(function() {
                  
                  trail.attr('height', 30)
                  .attr('id', pathId);

                  // Add the label at the end, for the percentage.
                  trail.append('svg:text')
                  .attr('id', pathLabelId)
                  .style('fill', '#000');
                  
                  // Mapping of step names to colors.
                  var colors = {
                  "home": "#5687d1",
                  "product": "#7b615c",
                  "search": "#de783b",
                  "account": "#6ab975",
                  "other": "#a173d1",
                  "end": "#bbbbbb"
                };
                //var colors = ['#5687d1', '#7b615c', '#de783b', '#6ab975', '#a173d1', '#bbbbbb'];
                  var numSteps =  data.steps.length;
                  //var firstStepCount = data.steps[0].count;
                  //var lastStepCount = data.steps[numSteps-1].count;
                  //var percentage = (100 *  lastStepCount/ firstStepCount).toPrecision(3);
                  var percentage = data.steps[numSteps-1].percent;
                  var percentageString = percentage + '%';
                  if (percentage < 0.1) {
                    percentageString = '< 0.1%';
                  }
                  // Data join; key function combines name and depth (= position in sequence).
                  var g = trail
                      .selectAll('g')
                      .data(data.steps, function(d) { 
                        return d.name + d.depth; 
                      });

                  // Add breadcrumb and label for entering nodes.
                  var b = {
                    w: 75, h: 30, s: 3, t: 10
                  }; 
                  var entering = g.enter().append('svg:g');
                  //console.log(entering);
                  
                  entering.append('svg:polygon')
                      .attr('points', getBreadcrumbString)
                      .style('fill', function(d, i) { return colors[d.name]; })
                      .on('mouseover', function(d){
                          var nodeSelection = d3.select(this).style({opacity:'0.7'});
                          nodeSelection.select('text').style({color:'#fff'});
                        })
                      .on('mouseleave', function(d){
                          var nodeSelection = d3.select(this).style({opacity:'1'});
                          nodeSelection.select('text').style({color:'#fff'});
                        });                      
                  
                  entering.append('svg:text')
                      .attr('x', (b.w + b.t) / 2)
                      .attr('y', b.h / 2)
                      .attr('dy', '0.35em')
                      .attr('text-anchor', 'middle')
                      .text(function(d) { return d.name;});

                  // Set position for entering and updating nodes.
                  g.attr('transform', function(d, i) {
                    return 'translate(' + i * (b.w + b.s) + ', 0)';
                  });

                  // Remove exiting nodes.
                  g.exit().remove();

                  // Now move and update the percentage at the end.
                  trail.select('#'+pathLabelId)
                      .attr('x', (numSteps + 0.5) * (b.w + b.s))
                      .attr('y', b.h / 2)
                      .attr('dy', '0.35em')
                      .attr('text-anchor', 'middle')
                      .text(percentageString);
                  // Make the breadcrumb trail visible, if it's hidden.
                  d3.select(pathId)
                        .style("visibility", "");

                  function getBreadcrumbString(d, i){
                    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.                 
                    var points = [];
                    points.push("0,0");
                    points.push(b.w + ",0");
                    points.push(b.w + b.t + "," + (b.h / 2));
                    points.push(b.w + "," + b.h);
                    points.push("0," + b.h);
                    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                      points.push(b.t + "," + (b.h / 2));
                    }
                    return points.join(" ");
                  }
                  }, 200); //timeout stops here
            };
        });
      }}
  })
  .directive('showErrors', function($timeout) {
    return {
      restrict: 'A',
      require: '^form',
      link: function (scope, el, attrs, formCtrl) {
        // find the text box element, which has the 'name' attribute
        var inputEl   = el[0].querySelector("[name]");
        // convert the native text box element to an angular element
        var inputNgEl = angular.element(inputEl);
        // get the name on the text box
        var inputName = inputNgEl.attr('name');
        
        // only apply the has-error class after the user leaves the text box
        inputNgEl.bind('blur', function() {
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
        
        scope.$on('show-errors-check-validity', function() {
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
        
        scope.$on('show-errors-reset', function() {
          $timeout(function() {
            el.removeClass('has-error');
          }, 0, false);
        });
      }
    }
  })
  .directive('queryTextFocus', function () { //focus directive
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.queryTextFocus, function (n, o) {
                if (n != 0 && n) {
                  //console.log(element);
                  //console.log(attr);
                  element[0].focus();
                  //scope[attrs.queryTextFocus] = false;
                }
            });
        }
    };
  })
  .directive('queryTextBlur', function () { //blur directive
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('blur', function () {
                //execute attribute queryTextBlur - if this was a method, it will be executed.
                //scope.$apply(attrs.queryTextBlur);
                //return scope value for focusing to false
                scope.$eval(attrs.queryTextFocus + '=false');
            });
        }
    };
  })
  .directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileInput);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
  }])
  .directive( 'editInPlace', function() {
    return {
      restrict: 'E',
      scope: { value: '=' },
      template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
      link: function ( $scope, element, attrs ) {
        // Let's get a reference to the input element, as we'll want to reference it.
        var inputElement = angular.element( element.children()[1] );
        
        // This directive should have a set class so we can style it.
        element.addClass( 'edit-in-place' );
        
        // Initially, we're not editing.
        $scope.editing = false;
        
        // ng-click handler to activate edit-in-place
        $scope.edit = function () {
          $scope.editing = true;
          
          // We control display through a class on the directive itself. See the CSS.
          element.addClass( 'active' );
          
          // And we must focus the element. 
          // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
          // we have to reference the first element in the array.
          inputElement[0].focus();
        };
        
        // When we leave the input, we're done editing.
        inputElement.prop( 'onblur', function() {
          $scope.editing = false;
          element.removeClass( 'active' );
        });
      }
    };
  })
  .factory('authInterceptor', function ($rootScope, $q, $window, $location) { // Interceptor & Config
  return {
    request: function (config) {
      //config.headers["Accept"] = "application/json";
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers['Authorization'] = $window.sessionStorage.token;
      }
      console.log(config.headers);
      return config;
    },
    response: function (response) {
      //anything to intercept response, if not let it go thru
      return response || $q.when(response);
    },
   'responseError': function(rejection) {
      // do something on error
      if(rejection.status === 401) {
        // handle the case where the user is not authenticated
        $location.path( "/login" );
      }
      return $q.reject(rejection);
    }
  };
  })
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://localhost:19980/**', 'http://mhnystatic2.s3.amazonaws.com/**']);
  })
  .config(function ($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];    
    //$httpProvider.interceptors.push('authInterceptor');
    //console.log($httpProvider.defaults.headers);
  })
  .config(function($tooltipProvider){
    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur',
      'show': 'hide'
    });
  });


if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(prefix) {
        return this.slice(0, prefix.length) == prefix;
    };
}
 
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.slice(-suffix.length) == suffix;
    };
}

function checkTextareaHeight(){
   var textarea = document.getElementById("query-output");
   if(textarea.selectionStart == textarea.selectionEnd) {
      textarea.scrollTop = textarea.scrollHeight;
   }
}

