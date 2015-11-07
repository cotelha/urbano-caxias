
angular.module("FPApp", [
  "ionic",
  "ngCordova",
  "angular-cache",

  "FPApp.services",

  "FPApp.controllers",

  "FPApp.routes"
])


.run(function($rootScope, $ionicPlatform, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {
    $ionicLoading.show({template: "Carregando..."});
    if ($rootScope.map !== undefined) {
      $rootScope.map.remove();
      console.log('map removido !!! ');
      $rootScope.map = undefined;
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(e, curr, prev) {
    $ionicLoading.hide();
  });
})


;

// Add array.where implementation
Array.prototype.where = Array.prototype.where || function(predicate) {
  var results = [],
      len = this.length,
      i = 0;

  for (; i < len; i++) {
    var item = this[i];
    if (predicate(item)) {
      results.push(item);
    }
  }

  return results;
};

Array.prototype.findBy = function(key, elem) {
  if (elem["" + key] !== undefined) elem = elem["" + key];
  return this.where(function(element){ return element["" + key] == elem; })[0];
}

Array.prototype.findById = function(elem) {
  return this.findBy("id", elem);
}

Array.prototype.indexOfById = function(elem) {
  if (elem.id !== undefined) elem = elem.id;
  return this.map(function(el) { return el.id }).indexOf(elem);
}
