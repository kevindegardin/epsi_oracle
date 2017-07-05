(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', '$location', '$http'];

  function run($rootScope, $location, $http) {
    $rootScope.userConnect = {};

    $rootScope.connect = function() {

      console.log($rootScope.userConnect);

      console.log('http://localhost:5000/user_profiles/connect/' + $rootScope.userConnect.login + '/' + $rootScope.userConnect.pwd);

      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }

      $http({
        method: 'GET',
        url: 'http://localhost:5000/user_profiles/connect/' + $rootScope.userConnect.login + '/' + $rootScope.userConnect.pwd
      }, config);
    };
  }

})();
