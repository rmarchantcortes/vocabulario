angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,  serveData) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 , name: 'title1', img: 'crayons.jpg'},
    { title: 'Chill', id: 2 , name: 'title2', img: 'libros.jpg'},
    { title: 'Dubstep', id: 3 , name: 'title3', img: 'letras.jpg'},
    { title: 'Indie', id: 4 , name: 'title4', img: 'lenguas.png'},
    { title: 'Rap', id: 5 , name: 'title5', img: 'idiomas.png'},
    { title: 'Cowbell', id: 6 , name: 'title6', img: 'crucigramas.jpg'}
  ];
    console.log(serveData.getdesblok());
    if(serveData.pasoPorService()){
      console.log("if");
      document.getElementById("radtitle2").checked = serveData.getdesblok();
    }else{

    }
  $scope.desbloquear = function() {
    console.log("metodo 1");
    serveData.desblok(true);
    document.getElementById("radtitle2").checked = serveData.getdesblok();
  };
  $scope.desbloquear1 = function() {
    console.log("metodo 1");
    serveData.desblok(true);
    document.getElementById("radtitle2").checked = serveData.getdesblok();
  };

})




.controller('PlaylistCtrl', function($scope, $stateParams, $location, serveData) {

});
