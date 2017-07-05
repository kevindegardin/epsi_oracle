(function () {

  'use strict';

  angular
    .module('app')
    .controller('ReservationController', ReservationController);

  ReservationController.$inject = ['$scope','$http','$stateParams'];

  function ReservationController($scope,$http,$stateParams) {

    $scope.voyageurs = [{id: 'choice1'}];
    $scope.prixtotal = [{}];
    $scope.totaltax = [{}];
    $scope.prixvoyage = [{}];

    $scope.addNewVoyageurs = function() {
      var newItemNo = $scope.voyageurs.length+1;
      $scope.voyageurs.push({'id':'choice'+newItemNo});
    };

    $scope.removeVoyageurs = function() {
      var lastItem = $scope.voyageurs.length-1;
      $scope.voyageurs.splice(lastItem);
    };

    $scope.calculGrandTotal = function() {
      var totaltaxe = $scope.voyageurs.length * $scope.etapes[0].PRIXVISITE + $scope.etapes[1].PRIXVISITE;
      $scope.totaltax = {totaltaxe};
      
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
            $scope.prixvoyage = $scope.threeDestinations;   
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });

      $http({
        method: 'GET',
        url: 'http://localhost:5000/etapesbycircuitid/'+$stateParams.id
      }, config)
      .then(function successCallback(response) {
          if(response.status == 200) {
            $scope.etapes = response.data;

            $scope.totaltax = $scope.etapes;
            if($scope.prixvoyage.length = 1){
              var prixto = $scope.prixvoyage[0].PRIX + $scope.totaltax[0].PRIXVISITE 
              $scope.prixtotal = {prixto};
            }else{
              var prixto = $scope.prixvoyage[0].PRIX + $scope.totaltax[0].PRIXVISITE + $scope.totaltax[1].PRIXVISITE; 
              $scope.prixtotal = {prixto};
            }
          }
      },
      function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
  };
}());
