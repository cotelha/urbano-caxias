angular.module("FPApp.routes", [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('index', {
      url: '/',
      controller: 'IndexCtrl'
    })
    .state('list', {
      url: '/list',
      templateUrl: 'templates/list.html',
      controller: "ListCtrl",
      resolve: {
        linesList: ['FPSvc2', function(FPSvc2) {
          return FPSvc2.loadLines();
        }]
      }
    })
    .state('show', {
      url: '/show/:id',
      templateUrl: 'templates/show.html',
      controller: "ShowCtrl",
      resolve: {
        line: ['FPSvc2', '$stateParams', function(FPSvc2, $stateParams) {
          return FPSvc2.getLine($stateParams.id);
        }],
        itineraries: ['FPSvc2', '$stateParams', '$filter', function(FPSvc2, $stateParams, $filter) {
          return FPSvc2.loadItineraries($stateParams.id, FPSvc2.searchPeriodForDays(), FPSvc2.searchPeriodForWeek());
        }]
      }
    })
    .state('show_itinerary', {
      url: '/show/:id/itinerary/:idItinerary',
      templateUrl: 'templates/show_itinerary.html',
      controller: 'ShowItineraryCtrl',
      resolve: {
        line: ['FPSvc2', '$stateParams', function(FPSvc2, $stateParams) {
          return FPSvc2.getLine($stateParams.id);
        }],
        itinerary: ['FPSvc2', '$stateParams', '$filter', function(FPSvc2, $stateParams, $filter) {
          return FPSvc2.getItinerary($stateParams.id, FPSvc2.searchPeriodForDays(), FPSvc2.searchPeriodForWeek(), $stateParams.idItinerary);
        }],
        stations: ['FPSvc2', '$stateParams', function(FPSvc2, $stateParams) {
          return FPSvc2.loadStations($stateParams.idItinerary);
        }]
      }
    })

  $urlRouterProvider.otherwise("/");
})

;