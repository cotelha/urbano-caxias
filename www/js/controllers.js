angular.module("FPApp.controllers", [])

.controller("IndexCtrl", [
          "$ionicLoading", "$state",
  function($ionicLoading,   $state) {
        $ionicLoading.show({template: "Carregando Linhas..."});
        $state.go('list');
  }
])

.controller("ListCtrl", [
          "$scope", "$sce", "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "sharedProperties", "FPSvc2", "linesList",
  function($scope,   $sce,   $ionicLoading,   $ionicListDelegate,   $ionicPlatform,   sharedProperties,   FPSvc2,   linesList) {

      $ionicLoading.hide();

      $scope.linesList = linesList["data"];

      $scope.clearString = function() {
          $scope.searchString="";
      }
  }

])


.controller("ShowCtrl", [
          "$scope", "$state", "$sce", "$ionicPopup", "$ionicListDelegate", "$ionicPlatform", "$filter", "FPSvc2", "line", "itineraries",
  function($scope,   $state,   $sce,   $ionicPopup,   $ionicListDelegate,   $ionicPlatform,   $filter,   FPSvc2,   line,   itineraries) {
      $scope.line = line;
      $scope.itineraries = itineraries["data"];

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Nenhum horário encontrado',
          template: 'Não foi encontrado horários para esta linha hoje.',
        });

        alertPopup.then(function(res) {
          $state.go('list')
        });

      };

      if ($scope.itineraries == false) {
        $scope.showAlert();
      }

      $scope.nome_tabela = $filter('filter')(typesDaysList, {value: FPSvc2.searchPeriodForWeek() })[0].text;
      $scope.nome_horario = $filter('filter')(SchedulesForDaysList, {value: FPSvc2.searchPeriodForDays() })[0].text;
  }

])

.controller("ShowItineraryCtrl", [
          "$scope", "$rootScope", "$stateParams", "$state", "$cordovaGeolocation", "$ionicPopup", "$filter", "FPSvc2", "line", "itinerary", "stations",
  function($scope,   $rootScope,   $stateParams,   $state,   $cordovaGeolocation,   $ionicPopup,   $filter,   FPSvc2,   line,   itinerary,   stations) {

    $scope.line = line;
    $scope.itinerary = itinerary;
    $scope.stations = stations["data"];

    $scope.alert_showed = false;

    var div = document.getElementById("map_canvas");

    // Invoking Map using Google Map SDK v2 by dubcanada
    $rootScope.map = plugin.google.maps.Map.getMap(div,{
        'camera': {
            'latLng': setPosition($scope.stations[0].lat, $scope.stations[0].lng),
            'zoom': 15
        }
    });


    $rootScope.map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $rootScope.map.addMarker({
            'position': setPosition(position.coords.latitude, position.coords.longitude),
            'title': "Estou aqui!"
          }, function(marker) {
            marker.showInfoWindow();
          });
          // $rootScope.map.setCenter(setPosition(position.coords.latitude, position.coords.longitude));
        }, function(err) {
          if(!$scope.alert_showed) {
            alert('Não foi possivel buscar a localização atual');
            $scope.alert_showed = true;
          }
        });

        // Bind markers
        for (var i = 0; i < $scope.stations.length; i++) {
            var station = $scope.stations[i];
            station.position = setPosition(station.lat, station.lng);

            $rootScope.map.addMarker({
                'station': station,
                'position': station.position,
                'title': 'Parada ' + (i+1),
                'snippet': station.ref,
                'icon': {
                 'url': imgPath('img/largeTDYellowIcons/marker'+(i+1)+'.png')
                 // 'url' : 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=0.5|0|2E8B57|8|b|'+(i+1)
                }
            }, function(marker) {
              marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
                marker.showInfoWindow();
              });
            });
        }
    });

    function imgPath(path) {
      if (window.location.protocol == 'file:') {
        return window.location.protocol+"//" + window.location.pathname.replace('index.html', path);
      } else {
        return window.location.origin + "/" + path;
      }
    }

    function setPosition(lat, lng) {
        return new plugin.google.maps.LatLng(lat, lng);
    }

  }
])


;
