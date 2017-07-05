(function () {

  'use strict';

  angular
    .module('app')
    .controller('VoyagesController', VoyagesController);

  VoyagesController.$inject = ['$scope','$http'];

  function VoyagesController($scope,$http) {

    $scope.getDestinations = {};
    var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
    }

    $http({
        method: 'GET',
        url: 'http://localhost:5000/circuit'
      }, config)
      .then(function successCallback(response) {
          if(response.status == 200) {
            $scope.threeDestinations = response.data;
            console.log(response.data);
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
    };
}());
