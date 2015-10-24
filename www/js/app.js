var FPApp = angular.module("FPApp", ["ionic"]);

FPApp.service("FPSvc2", ["$http", "$rootScope", "$ionicLoading", "$filter", FPSvc2]);

FPApp.filter ('searchFor', function () {
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
});

FPApp.service('sharedProperties', function () {
    var params = '';

    return {
        getParams: function () {
            return params;
        },
        setParams: function(value) {
            params = value;
        }
    };
});

FPApp.controller("FPCtrl",
    ["$scope", "$sce",
     "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "sharedProperties",
     "FPSvc2", FPCtrl]);

FPApp.controller("FPCtrl2",
    ["$scope", "$sce",
     "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "sharedProperties", "$filter",
     "FPSvc2", FPCtrl2]);

FPApp.run(function($ionicPlatform) {
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

function FPCtrl2($scope, $sce, $ionicLoading, $ionicListDelegate, $ionicPlatform, sharedProperties, $filter, FPSvc2) {
    var object_linha = sharedProperties.getParams();
    $scope.nome_linha = object_linha.descricao;
    var periodForWeek = FPSvc2.searchPeriodForWeek();
    var periodForDays = FPSvc2.searchPeriodForDays();

    $scope.nome_tabela = $filter('filter')(typesDaysList, {value: periodForWeek })[0].text;
    $scope.nome_horario = $filter('filter')(SchedulesForDaysList, {value: periodForDays })[0].text;

    var lista = FPSvc2.loadHorarios(object_linha, periodForDays, periodForWeek);
}

function FPCtrl($scope, $sce, $ionicLoading, $ionicListDelegate, $ionicPlatform, sharedProperties, FPSvc2) {

    $ionicLoading.show({template: "Carregando Linhas..."});
    FPSvc2.loadLines();
    $scope.clearString = function() {
        $scope.searchString="";
    }
    $scope.show = function($index) {
      sharedProperties.setParams( $scope.linesList[$index] );
    }
    $scope.share = function($index) {
        $ionicListDelegate.closeOptionButtons();
        window.socialmessage.send({
            url: $scope.blogs[$index].URL
        });
    }
}

function FPSvc2($http, $rootScope, $ionicLoading, $filter) {

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

var SchedulesForDaysList = [
  { text: "Todos os Horários", value: 0 },
  { text: "Das 05:00 às 12:00", value: 1 },
  { text: "Das 12:00 às 18:00", value: 2 },
  { text: "Das 18:00 às 24:00", value: 3 },
  { text: "Das 24:00 às 05:00", value: 4 }
];

var typesDaysList = [
  { text: "Dias Úteis", value: 1 },
  { text: "Sábado", value: 2 },
  { text: "Domingo", value: 3 },
  { text: "Passe Livre", value: 4 },
  { text: "Feriados", value: 6 }
];

var holidayList = [
  {
    data: "01/01",
    descricao: "Confraternização Universal"
  },
  {
    data: "21/04",
    descricao: "Tiradentes"
  },
  {
    data: "01/05",
    descricao: "Dia do Trabalho"
  },
  {
    data: "07/09",
    descricao: "Independência do Brasil"
  },
  {
    data: "12/10",
    descricao: "Nossa Senhora Aparecida"
  },
  {
    data: "02/11",
    descricao: "Finados"
  },
  {
    data: "15/11",
    descricao: "Proclamação da República"
  },
  {
    data: "25/12",
    descricao: "Natal"
  },
  {
    data: "20/09",
    descricao: "Proclamação da República Rio-Grandense ( Feriado Estadual )"
  },
  {
    data: "26/05",
    descricao: "Nossa Senhora do Caravaggio ( Feriado municipal )"
  }
]
