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
      // FPSvc2.loadLines();
      $scope.linesList = linesList["data"];

      $scope.clearString = function() {
          $scope.searchString="";
      }
      // $scope.show = function($index) {
      //   sharedProperties.setParams( $scope.linesList[$index] );
      // }
      $scope.share = function($index) {
          $ionicListDelegate.closeOptionButtons();
          window.socialmessage.send({
              url: $scope.blogs[$index].URL
          });
      }
  }

])


.controller("ShowCtrl", [
          "$scope", "$state", "$sce", "$ionicPopup", "$ionicListDelegate", "$ionicPlatform", "$filter", "FPSvc2", "line", "horariosList",
  function($scope,   $state,   $sce,   $ionicPopup,   $ionicListDelegate,   $ionicPlatform,   $filter,   FPSvc2,   line,   horariosList) {
      $scope.line = line;
      $scope.horariosList = horariosList["data"];

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Nenhum horário encontrado',
          template: 'Não foi encontrado horários para esta linha hoje.',
        });

        alertPopup.then(function(res) {
          $state.go('list')
        });

      };

      if ($scope.horariosList == false) {
        $scope.showAlert();
      }

      $scope.nome_tabela = $filter('filter')(typesDaysList, {value: FPSvc2.searchPeriodForWeek() })[0].text;
      $scope.nome_horario = $filter('filter')(SchedulesForDaysList, {value: FPSvc2.searchPeriodForDays() })[0].text;
  }

])


;