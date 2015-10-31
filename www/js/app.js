
angular.module("FPApp", [
  "ionic",

  "FPApp.services",

  "FPApp.controllers",

  "FPApp.routes"
])


.filter('searchFor', function () {
  // Filtra as Linhas
  return function (arr, searchString) {
    if (!searchString) {
      return arr;
    }
    var result = [];
    searchString = searchString.toLowerCase();

    // Usando o útil método forEach para iterar através do array
    angular.forEach (arr, function (item) {
      if (item.descricao.toLowerCase().indexOf(searchString) !== -1) {
        result.push(item);
      }
    });
    return result;
  };
})


.run(function($ionicPlatform) {
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
})


;
