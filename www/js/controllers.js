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
          "$scope", "$stateParams", "$state", "$cordovaGeolocation", "$ionicPopup", "$filter", "FPSvc2", "line", "itinerary", "stations",
  function($scope,   $stateParams,   $state,   $cordovaGeolocation,   $ionicPopup,   $filter,   FPSvc2,   line,   itinerary,   stations) {

    $scope.line = line;
    $scope.itinerary = itinerary;
    $scope.stations = stations["data"];

    console.log($scope.stations);

    var div = document.getElementById("map_canvas");

    // Invoking Map using Google Map SDK v2 by dubcanada
    var map = plugin.google.maps.Map.getMap(div,{
        'camera': {
            'latLng': setPosition($scope.stations[0].lat, $scope.stations[0].lng),
            'zoom': 15
        }
    });


    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        map.setCenter(setPosition(position.coords.latitude, position.coords.longitude));
      }, function(err) {
        console.log('não foi possivel buscar a localização atual');
        console.log(err);
      });

    map.addEventListener(plugin.google.maps.event.MAP_READY, function(){

        // Bind markers
        for (var i = 0; i < $scope.stations.length; i++) {
            var station = $scope.stations[i];
            station.position = setPosition(station.lat, station.lng);

            map.addMarker({
                'station': station,
                'position': station.position
            }, function(marker) {

                // Defining event for each marker
                // marker.on("click", function() {
                //     showAlert(marker.get('marker').ref);
                // });

            });
        }
    });

    function setPosition(lat, lng) {
        return new plugin.google.maps.LatLng(lat, lng);
    }

    function showAlert(ref) {
      var alertPopup = $ionicPopup.alert({
        title: 'Marker',
        template: ref,
      });
    };

  }
])


;
