
//Custom directive for displaying a modal

(function() {
    'use strict';

    angular
        .module('app')
        .directive('modal', modal);

    modal.$inject = [];

    /* @ngInject */
    function modal() {
        // Usage: Used to display a custom modal from a template
        //
        // Creates: Modal object from template
        //
        var directive = {
            //allow user to select modal template by setting template attribute in HTML
            templateUrl: function(element, attrs){         
                return '../../templates/' + attrs.template + '.html';
            },
            transclude: true,
      		  replace:true,
            restrict: 'E',
            scope: true,
            link: postLink,
        };
        return directive;

        function postLink(scope, element, attrs) {
          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    }

})();
