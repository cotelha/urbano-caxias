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
        horariosList: ['FPSvc2', '$stateParams', '$filter', function(FPSvc2, $stateParams, $filter) {
          return FPSvc2.loadHorarios($stateParams.id, FPSvc2.searchPeriodForDays(), FPSvc2.searchPeriodForWeek());
        }]
      }
    })

  $urlRouterProvider.otherwise("/");
})

;