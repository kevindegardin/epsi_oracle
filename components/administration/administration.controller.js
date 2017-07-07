(function () {

  'use strict';

  angular
    .module('app')
    .controller('AdministrationController', AdministrationController);

  AdministrationController.$inject = ['$scope','$http','$rootScope'];

  function AdministrationController($scope,$http,$rootScope) {

    $scope.select = {};
    $scope.userInscription = {};

    // BUTTONS
    $scope.IsVisibleUsers = false;
    $scope.IsVisibleEditUserStep1 = false;
    
    $scope.ShowHideUsers = function () {

      $scope.IsVisibleAddUser = false;
      $scope.IsVisibleDeleteUser = false;
      $scope.IsVisibleEditUserStep1 = false;
      $scope.IsVisibleEditUserStep2 = false;

      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisibleUsers = $scope.IsVisibleUsers ? false : true;
    }

    $scope.IsVisibleAddUser = false;
    $scope.addUsers = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisibleAddUser = $scope.IsVisibleAddUser ? false : true;
      $scope.IsVisibleUsers = false;
    }

    $scope.modifyUsers = function() {
      $scope.IsVisibleEditUserStep1 = $scope.IsVisibleEditUserStep1 ? false : true;
      $scope.IsVisibleUsers = false;
    }

    $scope.inscription = function() {
      $scope.userInscription.IDPERSONNE = Math.floor((Math.random() * 500)+50)
      $scope.userInscription.DATENAISSANCE = "2017/07/05";
      $scope.userInscription.ROLE = "client";

      console.log($scope.userInscription);

      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }

      $http({
        method: 'POST',
        url: 'http://localhost:5000/user_profiles/',
        data: JSON.stringify($scope.userInscription)
      }, config);

    };

    $scope.IsVisibleEditUserStep1 = function () {

    }

    $scope.deleteUsers = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisibleDeleteUser = $scope.IsVisibleDeleteUser ? false : true;
      $scope.IsVisibleUsers = false;
      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }

      $http({
        method: 'GET',
        url: 'http://localhost:5000/user_profiles'
      }, config).then(function successCallback(response) {
        if(response.status == 200) {
          $scope.threeDestinations = response.data;
          console.log(response.data);
        }
        },
        function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

    }
    // FIN BUTTONS

    $scope.confirmDelete = function() {
      console.log('confirme delete');
      console.log($scope.select);
    }
  };
})();
