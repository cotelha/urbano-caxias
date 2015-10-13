FPApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('page1', {
    url: '/1',
    templateUrl: 'page1.html'
  })
  .state('page2', {
    url: '/2',
    templateUrl: 'page2.html'
  })

  $urlRouterProvider.otherwise("/1");
})
