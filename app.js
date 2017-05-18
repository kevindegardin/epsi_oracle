(function () {

  'use strict';

  angular
    .module('app', ['ui.router', 'ui.materialize', 'angular-loading-bar'])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider'];

  function config($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

    //cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.latencyThreshold = 750;

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        controllerAs: 'homeController',
        templateUrl: 'components/home/home.html'
      });

    $urlRouterProvider.otherwise('/home');
  }

})();
