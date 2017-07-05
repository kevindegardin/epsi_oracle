(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', '$location', '$http'];

  function run($rootScope, $location, $http) {
    $rootScope.userConnect = {};
    $rootScope.userInscription = {};
    $rootScope.getDestinations = {};

    var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
    }

    $http({
        method: 'GET',
        url: 'http://localhost:5000/one'
      }, config)
      .then(function successCallback(response) {
          if(response.status == 200) {
            $rootScope.threeDestinations = response.data;
            console.log(response.data);
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    

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

            console.log(response.data);
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    };

    $rootScope.disconnect = function() {
      $rootScope.isAuthenticated = false;
      $rootScope.userConnected = {};
    }

    $rootScope.inscription = function() {

      $rootScope.userInscription.IDPERSONNE = Math.floor((Math.random() * 500)+50)
      $rootScope.userInscription.DATENAISSANCE = "2017/07/05";
      $rootScope.userInscription.ROLE = "client";

      console.log($rootScope.userInscription);

      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }

      $http({
        method: 'POST',
        url: 'http://localhost:5000/user_profiles/',
        data: JSON.stringify($rootScope.userInscription)
      }, config);

    };
  }

})();
