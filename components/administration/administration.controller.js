(function () {

  'use strict';

  angular
    .module('app')
    .controller('AdministrationController', AdministrationController);

  AdministrationController.$inject = ['$scope','$http'];

  function AdministrationController($scope,$http) {

    // BUTTONS
    $scope.IsVisibleUsers = false;
    $scope.ShowHideUsers = function () {

      $scope.IsVisibleAddUser = false;
      $scope.IsVisibleDeleteUser = false;
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisibleUsers = $scope.IsVisibleUsers ? false : true;
    }

    $scope.IsVisibleAddUser = false;
    $scope.addUsers = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisibleAddUser = $scope.IsVisibleAddUser ? false : true;
      $scope.IsVisibleUsers = false;
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
    }

  };
})();
