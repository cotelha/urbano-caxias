angular.module("FPApp.services", ['angular-cache'])

.service("FPSvc2", [
                 "$http", "$rootScope", "$ionicLoading", "$filter", "$q", "CacheFactory",
  function FPSvc2($http,   $rootScope,   $ionicLoading,   $filter,   $q,   CacheFactory) {

      if (!CacheFactory.get('linesCache')) {
        CacheFactory.createCache('linesCache', {
          storageMode: 'localStorage'
        });
        // clear cache with
        // CacheFactory.destroy('linesCache');
      }

      this.BASE_URL = "http://www.gerenciamentorgcom.com.br/m/ws/";

      var linesCache = CacheFactory.get('linesCache');

      this.loadLines = function() {
        return $http.get(this.BASE_URL + "linhas_web.php", {
                  params: {user: "37"},
                  cache: linesCache
                });
      }

      this.getLine = function(id) {
        // cria um promise que será retornado assim que
        // o promise anterior retornar
        var deferred = $q.defer();
        this.loadLines()
          .success(function(data) {
            // data é a lista de linhas
            deferred.resolve(data.findById(id))
          })
          .error(deferred.reject);
        return deferred.promise;
      }

      this.isCachedLine = function(line, tabela, horario) {
        cacheKey = this.BASE_URL + "horarios_web.php?horario="+ horario +"&linha=" + line.id + "&tabela=" + tabela + "&user=37";
        return linesCache.get(cacheKey) !== undefined;
      }

      this.loadItineraries = function(id_line, params_horario, params_tabela) {
          return $http.get(this.BASE_URL + "horarios_web.php", {
                  params: {linha: id_line, tabela: params_tabela, horario: params_horario, user: 37 },
                  cache: linesCache
                });
      }

      this.getItinerary = function(id_line, params_horario, params_tabela, id_itinerary, hour) {
        // cria um promise que será retornado assim que
        // o promise anterior retornar
        var deferred = $q.defer();
        this.loadItineraries(id_line, params_horario, params_tabela)
          .success(function(data) {
            // data é a lista de linhas
            console.log(hour);
            deferred.resolve(data.findBy("itinerario", id_itinerary, true).findBy("hora", hour))
          })
          .error(deferred.reject);
        return deferred.promise;
      }

      this.loadStations = function(itinerary) {
        return $http.get(this.BASE_URL + "trajetos_web.php", {
                  params: {itinerario: itinerary, user: 37 },
                  cache: linesCache
                });
      }

      this.loadBusLocale = function(itinerary) {
        // [{"dtresposta":"2015-11-07 21:41:43","lat":"-29.166825","lng":"-51.177123"}]
        return $http.get(this.BASE_URL + "bus_web.php", {
                  params: {itinerario: itinerary, user: 37 },
                });
      }

      this.searchPeriodForDays = function () {
        return 0;
        var today = new Date().getHours();
        if (today >= 5 && today <= 12) {
          //Das 05:00 às 12:00
          return 1;
        } else if (today >= 13 && today <= 18) {
          //Das 12:00 às 18:00
          return 2;
        } else if (today >= 19 && today <= 23) {
          //Das 18:00 às 24:00
          return 3;
        } else if (today >= 0 && today <= 4) {
          // Das 24:00 às 05:00
          return 4;
        }else {
          // TODOS OS HORÁRIOS
          return 0;
        }
      }

      this.searchPeriodForWeek = function () {
        var current_date = new Date();
        // BUSCA FERIADO;
        searchFeriado = $filter('filter')(holidayList, {data: current_date.getDate()+"/"+(current_date.getMonth()+1) });
        if (Object.keys(searchFeriado).length!=0) {
          return 6;
        }

        // BUSCA O DIA DA SEMANA
        switch (current_date.getDay()) {
            case 0:
              // DOMINGO
              return 3;
            case 6:
              // SÁBADO
              return 2;
            default:
              // DIAS DE SEMANA
              return 1;
        }
      }
  }
])


.service("DirectionService", [
                           "$http", "$rootScope", "$ionicLoading", "$filter", "$q", "CacheFactory",
  function DirectionService($http,   $rootScope,   $ionicLoading,   $filter,   $q,   CacheFactory) {
    if (!CacheFactory.get('polylineCache')) {
      CacheFactory.createCache('polylineCache', {
        storageMode: 'localStorage'
      });
      // clear cache with
      // CacheFactory.destroy('polylineCache');
    }

    var polylineCache = CacheFactory.get('polylineCache');


    this.get_directions = function(origin, destination, waypoints, control) {
      var directionsService = new google.maps.DirectionsService();
      var rsp;
      var deferred = $q.defer();
      var request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.DirectionsTravelMode["DRIVING"]
      };
      var cacheKey = JSON.stringify(request);
      if (polylineCache.get(cacheKey)) {
        console.log('get from cache!!')
        rsp = polylineCache.get(cacheKey);
        rsp.control = control;
        deferred.resolve(rsp);
      } else {

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              rsp = response.routes[0];
              polylineCache.put(cacheKey, rsp);
              rsp.control = control;
              deferred.resolve(rsp);
            } else {
              deferred.reject;
            }
          }
        );
      }
      return deferred.promise;
    }

    this.decodePolyline = function(encoded) {
      precision = 5;
      precision = Math.pow(10, -precision);
      var len = encoded.length, index=0, lat=0, lng = 0, array = [];
      while (index < len) {
          var b, shift = 0, result = 0;
          do {
              b = encoded.charCodeAt(index++) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
          } while (b >= 0x20);
          var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lat += dlat;
          shift = 0;
          result = 0;
          do {
              b = encoded.charCodeAt(index++) - 63;
              result |= (b & 0x1f) << shift;
              shift += 5;
          } while (b >= 0x20);
          var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lng += dlng;
          array.push( new plugin.google.maps.LatLng(lat * precision, lng * precision) );
      }
      return array;
    }

    this.get_polyline_points_by_stations = function(all_stations) {
      var deferred = $q.defer(),
          self = this,
          i,j,chunk = 10
          polylines = [];

      for (i=0,j=all_stations.length; i<j; i+=chunk) {
          stations = all_stations.slice(i,i+chunk);

          var origin = stations[0].lat + "," + stations[0].lng;
          var destination = stations[stations.length-1].lat + "," + stations[stations.length-1].lng;
          var waypoints = stations.slice(1, -1).map(function(st) { return {location: st.lat + "," + st.lng } });
          this.get_directions(origin, destination, waypoints, i+chunk)
            .then(function(response) {
              polylines = polylines.concat(self.decodePolyline(response.overview_polyline));
              console.log(polylines);
              console.log(response.control, all_stations.length);
              if (response.control >= all_stations.length) {
                console.log("deferred");
                deferred.resolve(polylines);
              }
            })
            ;
      }
      return deferred.promise;
    }
  }
])


;
