angular.module("FPApp.services", [])

.service("FPSvc2", [
                 "$http", "$rootScope", "$ionicLoading", "$filter",
  function FPSvc2($http,   $rootScope,   $ionicLoading,   $filter) {

      this.loadLines = function() {
          $http.get("http://www.gerenciamentorgcom.com.br/m/ws/linhas_web.php", {
                  params: {user: "37"}})
              .success(function(result) {
                  // "id":"29","descricao":"ADORADO\/IRACEMA\/SANTO ANT\u00d4NIO\/JD. DA COLINA"
                  $rootScope.linesList = result;
                  $ionicLoading.hide();
              });
      }

      this.loadHorarios = function(params, params_horario, params_tabela) {
          var cod_linha = params.id;
          $http.get("http://www.gerenciamentorgcom.com.br/m/ws/horarios_web.php", {
                  params: {linha: cod_linha, tabela: params_tabela, horario: params_horario, user: 37 }})
              .success(function(result) {
                  // {"destino":"SAI STA HELENA\/AV.FRAN\u00c7A\/LA PALOMA\/DANTE","itinerario":"17033","hora":"05:25:00","nlinha":"BELA VISTA","elevador":"*"}
                  $rootScope.horariosList = result;
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
        searchFeriado = $filter('filter')(holidayList, {data: current_date.getDate()+"/"+(current_date.getMonth()+1) }, true);
        console.log(Object.keys(searchFeriado).length);
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


.service('sharedProperties', function () {
    var params = '';

    return {
        getParams: function () {
            return params;
        },
        setParams: function(value) {
            params = value;
        }
    };
})


;
