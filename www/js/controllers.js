angular.module("FPApp.controllers", [])

.controller("IndexCtrl", [
          "$ionicLoading", "$state",
  function($ionicLoading,   $state) {
        $ionicLoading.show({template: "Carregando Linhas..."});
        $state.go('list');
  }
])

.controller("ListCtrl", [
          "$scope", "$sce", "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "FPSvc2", "linesList",
  function($scope,   $sce,   $ionicLoading,   $ionicListDelegate,   $ionicPlatform,   FPSvc2,   linesList) {

      $ionicLoading.hide();

      $scope.linesList = linesList["data"];

      $scope.clearString = function() {
          $scope.searchString="";
      }

      $scope.isCachedLine = function(line) {
        if (line.cached === undefined) {
          var cx = FPSvc2.isCachedLine(line, FPSvc2.searchPeriodForWeek(), FPSvc2.searchPeriodForDays());
          line.cached = cx;
        }
        return line.cached;
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
          "$scope", "$rootScope", "$stateParams", "$state", "$interval", "$cordovaGeolocation", "$ionicPopup", "$filter", "FPSvc2", "DirectionService", "line", "itinerary", "stations",
  function($scope,   $rootScope,   $stateParams,   $state,   $interval,   $cordovaGeolocation,   $ionicPopup,   $filter,   FPSvc2,   DirectionService,   line,   itinerary,   stations) {

    $scope.line = line;
    $scope.itinerary = itinerary;
    $scope.stations = stations["data"];

    $scope.alert_showed = false;

    var div = document.getElementById("map_canvas");

    document.addEventListener("deviceready", function() {

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
            //
          }, function(err) {
            if(!$scope.alert_showed) {
              alert('Não foi possivel buscar a localização atual');
              $scope.alert_showed = true;
            }
          });

          // Add bus marker to map
          $rootScope.map.addMarker({
              'position': setPosition($scope.stations[0].lat, $scope.stations[0].lng),
              'title': 'Ônibus',
              'snippet': "Localização aproximada",
              'icon': {
               'url': imgPath('img/bus.png')
              }
          }, function(marker) {
            $scope.bus_marker = marker;
            $scope.bus_marker.setVisible(false);
            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
              marker.showInfoWindow();
            });
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

          $rootScope.bus_interval = $interval(getBusLocale, 5000);

          DirectionService.get_polyline_points_by_stations($scope.stations)
            .then(function(polyline_points) {
              console.log(polyline_points);
              $rootScope.map.addPolyline({
                points: polyline_points,
                'color' : '#00FF00',
              });
            });
      });

    });

    function getBusLocale() {
      FPSvc2.loadBusLocale($scope.itinerary.itinerario)
        .then(function(res) {
          var data = res["data"]
          if (data != false) {
            data = data[0];
            $scope.bus_marker.setPosition(setPosition(data.lat, data.lng));
            setMapPosition(data.lat, data.lng);
            if (!$scope.bus_marker.isVisible()) $scope.bus_marker.setVisible(true);
          } else {
            $scope.bus_marker.setVisible(false);
          }
        })
    }

    function imgPath(path) {
      if (window.location.protocol == 'file:') {
        return window.location.protocol+"//" + window.location.pathname.replace('index.html', path);
      } else {
        return window.location.origin + "/" + path;
      }
    }

    function setMapPosition(lat, lng) {
      $rootScope.map.setCenter(setPosition(lat, lng));
    }

    function setPosition(lat, lng) {
        return new plugin.google.maps.LatLng(lat, lng);
    }

  }
])


;
