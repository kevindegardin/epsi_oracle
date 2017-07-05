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
      }, config)
      .then(function successCallback(response) {
          if(response.status == 200) {
            $rootScope.isAuthenticated = true;
            $rootScope.userConnected = response.data;

            $("modal").closeModal();

            console.log(response.data);
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    };
  }

})();
