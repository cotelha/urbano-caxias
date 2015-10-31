angular.module("FPApp.controllers", [])

.controller("FPCtrl", [
                 "$scope", "$sce", "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "sharedProperties", "FPSvc2",
  function FPCtrl($scope,   $sce,   $ionicLoading,   $ionicListDelegate,   $ionicPlatform,   sharedProperties,   FPSvc2) {

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

])


.controller("FPCtrl2", [
                  "$scope", "$sce", "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "sharedProperties", "$filter", "FPSvc2",
  function FPCtrl2($scope,   $sce,   $ionicLoading,   $ionicListDelegate,   $ionicPlatform,   sharedProperties,   $filter,   FPSvc2) {
      var object_linha = sharedProperties.getParams();
      $scope.nome_linha = object_linha.descricao;
      var periodForWeek = FPSvc2.searchPeriodForWeek();
      var periodForDays = FPSvc2.searchPeriodForDays();

      $scope.nome_tabela = $filter('filter')(typesDaysList, {value: periodForWeek })[0].text;
      $scope.nome_horario = $filter('filter')(SchedulesForDaysList, {value: periodForDays })[0].text;

      var lista = FPSvc2.loadHorarios(object_linha, periodForDays, periodForWeek);
  }

])


;