(function(){
  'use strict';

  var module = angular.module('cdServices', []);


  // global application instance
  module.service('gApp', ['$http', 'Utils', function($http, Utils) {

    // Most Important Variables
    this.mostImpVars = [];

    this.postRequest = function(url, data, callback, context, timeout) {
      if (!timeout) {
        timeout = 15 * 1000;
      }

      var handler = function(d, e) {
        if (callback) {
          if (context) {
            callback.call(context, d, 0);
          }
          else {
            callback(d, e);
          }
        }
      };

      $http.post(url, data, {timeout: timeout}).
        success(function(data, status, headers, config, statusText) {
          handler(data, 0);
        }).
        error(function(data, status, headers, config, statusText) {
          handler(status, true);
        });
    };


    this.getRequest = function(url, callback, context, timeout) {
      if (!timeout) {
        timeout = 15 * 1000;
      }

      var handler = function(d, e) {
        if (callback) {
          if (context) {
            callback.call(context, d, 0);
          }
          else {
            callback(d, e);
          }
        }
      };

      $http.get(url, {timeout: timeout}).
        success(function(data, status, headers, config, statusText) {
          handler(data, 0);
        }).
        error(function(data, status, headers, config, statusText) {
          handler(status, true);
        });
    };


    var canvas = new fabric.StaticCanvas('cdcanvas');

    this.genClusterImage = function(percentage, fillColor, strokeColor, imgid) {

      var n = Math.ceil(percentage),
        seq = [],
        i;

      for (i = 0; i < n; i++) {
        seq.push(i);
      }

      Utils.shuffle(seq);
      canvas.clear();

      if (imgid) {
        var imgElement = document.getElementById(imgid);
        var imgInstance = new fabric.Image(imgElement, {
          left: 0,
          top: 0
        });
        canvas.add(imgInstance);
      }


      for (i = 0; i < n; i++) {
        var angle = 0.5 * seq[i],
          x = 70 + (7 + 0.7 * angle) * Math.cos(angle) + (Math.random() - 0.5) * 10,
          y = 70 + (7 + 0.7 * angle) * Math.sin(angle) + (Math.random() - 0.5) * 10;

        var circle = new fabric.Circle({
          left: x, top: y, radius: 5,
          fill: fillColor, stroke: strokeColor, strokeWidth: 1
        });

        circle.setGradient('fill', {
          x1:0, y1: -circle.height / 2,
          x2: 0, y2: circle.height / 2,
          colorStops: {0: '#fff', 1: fillColor}
        });

        canvas.add(circle);
      }

      var dataURL = canvas.toDataURL({
        format: 'png'
      });

      return dataURL;
    };

  }]);


   //Utils
  module.factory('Utils', [ function() {
    return {
      shuffle: function (o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      }
    };
  }]);

})();
