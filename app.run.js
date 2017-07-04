(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', '$location', '$http'];

  function run($rootScope, $location, $http) {
    $rootScope.connect = function() {
      console.log($rootScope.userConnect);

      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }

      $http({
        method: 'GET',
        url: 'http://localhost:5000/user_profiles/connect/test/test'
      }, config);
    };
  }

})();
