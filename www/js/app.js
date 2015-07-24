(function(){
  'use strict';

  var module = angular.module('app', ['ngAnimate', 'cdServices', 'cdDirectives', 'camelCaseToHuman']);

  module.controller('appCtrl',['$scope', '$window', '$timeout', 'gApp', function($scope, $window, $timeout, gApp) {

    $scope.data = {};
    $scope.listAnalysis = {};

    $scope.varsLimit = 5;
    $scope.visibleGreenArea = false;
    $scope.analysisId = '';
    $scope.clusterImage = [];


    var clusterColors = [
      {fill: '#3b95d1', stroke: '#026cff'},
      {fill: '#42ceb3', stroke: '#105346'},
      {fill: '#bc82d7', stroke: '#5c326f'},
      {fill: '#f77470', stroke: '#783230'},
      {fill: '#f28343', stroke: '#67381d'}
    ];

    /* functions to assess cluster */
    $scope.func = {
      assessValue: function(varname, cluster) {
        var values = cluster.clusterCenters;

        if ( angular.isUndefined(values[varname]) ) {
          return {
            val: 'Not relevant',
            style: 'val-not-relevant'
          };
        }
        else {
          var val = values[varname];

          if (varname === 'bought') {
            return { val: val[1] };
          }
          else {
            return { val: val };
          }
        }
      },

      removeMostImpVar: function(index) {
        $scope.mostImpVars.splice(index, 1);
      }
    };


    // see more variables
    $scope.nextMostImpVars = function() {
      if ($scope.varsLimit + 5 > gApp.mostImpVars.length) {
        $scope.varsLimit = gApp.mostImpVars.length;
      }
      else {
        $scope.varsLimit = $scope.varsLimit + 5;
      }
    };


    // show cluster description on mouse-move
    var prevMoment = 0;
    $scope.mousemoveOnMain = function(e) {

      if ($scope.countVars > 0) {

        var x = e.pageX, y = e.pageY;

        if (x > 407 && x < 560) {
          if ($scope.visibleGreenArea === false) {
            if (Date.now() - prevMoment > 750) {
              $scope.visibleGreenArea = true;
              prevMoment = Date.now();
            }
          }
        } else {
          if ($scope.visibleGreenArea === true) {
            if (Date.now() - prevMoment > 750) {
              $scope.visibleGreenArea = false;
              prevMoment = Date.now();
            }
          }
        }
      }

    };

    // when a user choose a value from 'Clip a coupon' dropdown menu
    $scope.$watch('analysisId', function(newValue) {
      if (newValue) {
        param.analysisId = newValue;

        gApp.postRequest(url, param, callback);
      }
    });


    // url to get list of Analysis
    var url0 = 'http://52.8.91.45:3000/analysis?userId=toto&privateKey=123';

    // main request
    var url = 'http://52.8.91.45:3000/kmeans',
      param = {
        privateKey: 123,
        userId: 'toto',
        analysisId: ''
      };

    var callback = function(data, error) {
      if (error) {
        $window.alert('Failed to call API');
        return;
      }
      else if (data.error) {
        $scope.data = {};
        $scope.clusterImage = [];
        $scope.mostImpVars = [];
        delete $scope.countVars;
        return;
      }

      // sort by userCount
      data.clusters.sort(function(a, b) {
        return b.userCount - a.userCount;
      });

      // extract most-important-vars
      var wciArr = data.clusters[0].withinClusterImportance;
      gApp.mostImpVars = [];
      for (var prop in wciArr) {
        gApp.mostImpVars[wciArr[prop] - 1] = prop;
      }

      $scope.data = data;
      $scope.mostImpVars = gApp.mostImpVars;
      $scope.countVars = gApp.mostImpVars.length;


      // generate images for Clusters
      for (var i = 0; i < data.clusters.length; i++) {
        var c = data.clusters[i];
        var p = parseInt(c.userCount * 1000 / data.population) / 10;

        if (i < clusterColors.length) {
          if (i === 0) {
            $scope.clusterImage[i] = gApp.genClusterImage(p, clusterColors[i].fill, clusterColors[i].stroke, 'image1');
          }
          else if (i === 1) {
            $scope.clusterImage[i] = gApp.genClusterImage(p, clusterColors[i].fill, clusterColors[i].stroke, 'image2');
          }
          else {
            $scope.clusterImage[i] = gApp.genClusterImage(p, clusterColors[i].fill, clusterColors[i].stroke);
          }
        }
        else {
          $scope.clusterImage[i] = gApp.genClusterImage(p, '#526b82', '#526b82');
        }
      }

    };



    /* entry to do logic */
    gApp.getRequest(url0, function(data, error) {
      if (error) {
        $window.alert('Failed to call API');
      }
      else {
        $scope.listAnalysis = data.Analysis;
      }
    });

  }]);


})();
