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
    //screen.lockOrientation('portrait');
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $sce, $http, $timeout, serveData) {
  /*document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
            screen.lockOrientation('portrait');

    }*/
  $scope.playlists = [
    { title: 'Nivel 1', id: 1 , name: 'title1', img: 'crayons.jpg'},
    { title: 'Chill', id: 2 , name: 'title2', img: 'libros.jpg'},
    { title: 'Dubstep', id: 3 , name: 'title3', img: 'letras.jpg'},
    { title: 'Indie', id: 4 , name: 'title4', img: 'lenguas.png'},
    { title: 'Rap', id: 5 , name: 'title5', img: 'idiomas.png'},
    { title: 'Cowbell', id: 6 , name: 'title6', img: 'crucigramas.jpg'}
  ];
  $scope.iniciar = function(id) {
    switch(id){
      case 1:
        $scope.iniciarNivel1();
        break;
      ;
      default:

  };
  $scope.iniciarNivel1 = function() {
    
    //$scope.sinonimos = ;
    var urlCompleta ="http://www.vocabulario.esy.es/persistirVocabularioService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                          console.log(response.data);
                          $scope.include = response.data;
                        },
    function (){
                  alert('Error al importar los datos del minijuego');
                }
          );
  };
  //$window.location.href= $scope.include(0).include;
  //sinonimos();
  $scope.sinonimos = function() {
    //$scope.include = [{nombre: 'sinonimos.html'}];
  };
    //console.log(serveData.getdesblok());
    /*if(serveData.pasoPorService()){
      console.log("if");
      document.getElementById("radtitle2").checked = serveData.getdesblok();
    }else{

    }*/
  $scope.desbloquear1 = function() {
    console.log("metodo 1");
    serveData.desblok(true);
    document.getElementById("radtitle2").checked = serveData.getdesblok();
  };

  /*//<![CDATA[
// 1000 = 1 segundo
var mins = 59;
var segs = 59;
var s;
$scope.minutos = function(){
document.getElementById("minutos").innerHTML=mins;
console.log("min");
if(mins == 0){
var dm = clearInterval(m);

}else{

}
//s = $timeout($scope.segundos(), 1000);
mins--;
};
 
$scope.segundos = function(){
  console.log("seg");
document.getElementById("segundos").innerHTML=segs;
if(segs == 0){
location.reload();
var ds = clearInterval(s);
}else{
  //s = $timeout($scope.segundos(), 1000);
}
segs--;
};
 
var m = $timeout($scope.minutos(), 1000);
//]]>*/
})
.controller('PlaylistCtrl', function($scope, $stateParams, $location, serveData) {

});
