(function() {
  'use strict';

  var module = angular.module('cdDirectives', []);

  module.directive('backImg', function(){
    return function(scope, element, attrs){
      attrs.$observe('backImg', function(value) {
        element.css({
          'background-image': "url('" + value +"')"
        });
      });
    };
  });

})();
