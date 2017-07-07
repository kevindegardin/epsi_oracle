(function () {

  'use strict';

  angular
    .module('app', ['ui.router', 'ui.materialize'])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        controllerAs: 'homeController',
        templateUrl: 'components/home/home.html'
      })
      .state('/reservation/:id', {
        url: '/reservation/:id',
        controller: 'ReservationController',
        controllerAs: 'reservationController',
        templateUrl: 'components/reservation/reservation.html'
      })
      .state('/voyages', {
        url: '/voyages',
        controller: 'VoyagesController',
        controllerAs: 'voyagesController',
        templateUrl: 'components/voyages/voyages.html'
      });

    $urlRouterProvider.otherwise('/home');
  }

})();
