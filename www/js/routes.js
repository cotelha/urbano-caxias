angular.module("FPApp.routes", [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url: '/list',
      templateUrl: 'templates/list.html'
    })
    .state('show', {
      url: '/show',
      templateUrl: 'templates/show.html'
    })

  $urlRouterProvider.otherwise("/list");
})

;