(function () {

  'use strict';

  angular
    .module('app')
    .controller('ReservationController', ReservationController);

  ReservationController.$inject = ['$scope','$http','$stateParams'];

  function ReservationController($scope,$http,$stateParams) {

    // stock le prix total ( taxes + voyages )
    $scope.prixtotal = [{}];
    // stock total des taxes
    $scope.totaltax = [{}];
    // stock prix du voyage
    $scope.prixvoyage = [{}];

    // calcul du prix total a chaque ajout ou suppresion de passagers
    $scope.calculGrandTotal = function() {
      var totaltaxe = $scope.voyageurs.length * $scope.etapes[0].PRIXVISITE + $scope.etapes[1].PRIXVISITE;
      $scope.totaltax = {totaltaxe};

      var totalvoyage = $scope.voyageurs.length * $scope.threeDestinations[0].PRIX ;
      var prixto = totaltaxe + totalvoyage;
      $scope.prixtotal = {prixto};
    };

/*
/ RESERVATION
*/

/*

Besoin de 3 champs : Nom, Prénom, Date de Naissance
L'utilisateur ajoute dynamiquement le nombre de voyageur ( Du coup pour 2 voyageurs il y aura 2 fois les champs du dessus)
Je dois ensuite récuperer le nom, prenom et date de naissance de chaque voyageur

Proposition :

Avant d'afficher les champs, demander le nombre de passager afin de pouvoir générer les champs en conséquences ?


*/


/*
/ RESERVATION
*/
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
