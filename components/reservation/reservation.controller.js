(function () {

  'use strict';

  angular
    .module('app')
    .controller('ReservationController', ReservationController);

  ReservationController.$inject = ['$scope','$http','$stateParams'];

  function ReservationController($scope,$http,$stateParams) {

    $scope.voyageurs = [{id: 'choice1'}];
    $scope.prixtotal = [{}];

    $scope.addNewVoyageurs = function() {
      var newItemNo = $scope.voyageurs.length+1;
      $scope.voyageurs.push({'id':'choice'+newItemNo});
    };

    $scope.removeVoyageurs = function() {
      var lastItem = $scope.voyageurs.length-1;
      $scope.voyageurs.splice(lastItem);
    };

    $scope.calculGrandTotal = function() {
      var totaltaxe = $scope.voyageurs.length * $scope.threeDestinations[0].PRIXVISITE;
      var totalvoyage = $scope.voyageurs.length * $scope.threeDestinations[0].PRIX ;
      var prixto = totaltaxe + totalvoyage;
      $scope.prixtotal = {prixto};
    };

    $scope.getDestinations = {};
    var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
    }

    $http({
        method: 'GET',
        url: 'http://localhost:5000/circuitbyid/'+$stateParams.id
      }, config)
      .then(function successCallback(response) {
          if(response.status == 200) {
            $scope.threeDestinations = response.data;
            var totaltaxe = $scope.voyageurs.length * $scope.threeDestinations[0].PRIXVISITE;
            var totalvoyage = $scope.voyageurs.length * $scope.threeDestinations[0].PRIX ;
            var prixto = totaltaxe + totalvoyage;
            $scope.prixtotal = {prixto};
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
  };
}());
