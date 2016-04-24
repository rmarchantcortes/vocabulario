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

.controller('LevelsCtrl', function($scope, $sce, $http, serveData, serveInclude) {
  /*document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
            screen.lockOrientation('portrait');

    }*/
  //$scope.page=serveInclude.getPage();s
  $scope.levels = [
    { title: 'Nivel 1', id: 1 , name: 'title1', img: 'crayons.jpg', link: 'synonymous.html'},
    { title: 'Nivel 2', id: 2 , name: 'title2', img: 'libros.jpg', link: 'playlist.html'},
    { title: 'Nivel 3', id: 3 , name: 'title3', img: 'letras.jpg', link: 'synonymous.html'},
    { title: 'Nivel 4', id: 4 , name: 'title4', img: 'lenguas.png', link: 'synonymous.html'},
    { title: 'Nivel 5', id: 5 , name: 'title5', img: 'idiomas.png', link: 'synonymous.html'},
    { title: 'Nivel 6', id: 6 , name: 'title6', img: 'crucigramas.jpg', link: 'synonymous.html'}
  ];
  $scope.startLevels = function(id) {
    console.log('iniciar: '+id);
    serveInclude.setPage(id);
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
.controller('SynonymousCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, serveInclude) {
  var words = [];
  var vocabularyLength = 0;
  var matrix = [];
  var page = angular.element(document.getElementById('contenedor'));
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.showAlertPopUp = function(title, template){
    if(template == null){
      var alertPopup = $ionicPopup.alert({
          title: title
      });
    }else{
      var alertPopup = $ionicPopup.alert({
          title: title,
          template: template
      });
    }
  };
  $scope.itemSelected= function(id){
    if($scope.id==id){
      if(vocabularyLength>0){
        $scope.showAlertPopUp('Muy Bien', null);
        $scope.showGame();
      }else{
        $scope.showAlertPopUp('Muy Bien', 'Se acabaron las palabras');
        page.empty();
      }
    }else{
      if(vocabularyLength>0){
        $scope.showAlertPopUp('Fallaste, intenta en la siguiente', null);
        $scope.showGame();
      }else{
        $scope.showAlertPopUp('Fallaste', 'Se acabaron las palabras');
        page.empty();
      }
    }
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };

  $scope.loadBefore = function() {
    // Start showing the progress
    $scope.show($ionicLoading);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/persistirVocabularyService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                  $scope.vocabulary = response.data;
                  vocabularyLength = $scope.vocabulary.length;
                  console.log(vocabularyLength);
                  switch(serveInclude.getPage()){
                    case 1:
                      $scope.numdata = 3;
                  }
                  if($scope.showGame()==true){
                    $scope.hide($ionicLoading);  
                    $scope.showAlertPopUp('Iniciar juego', 'Preparate!');
                  }else{
                    $scope.hide($ionicLoading); 
                    $scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
                  }
                },
                function (){
                  $scope.hide($ionicLoading);  
                  $scope.showAlertPopUp('Error', 'No se han podido importar los datos');
                }
    );
  };
  $scope.contains = function(Array, element) {
    for (var i = 0; i < Array.length; i++) {
        if (Array[i] == element) {
            return true;
        }
    }
    return false;
  }
  $scope.setMatrix = function(idMatrix, sinonimoMatrix){
    var array=[];
    array.push(idMatrix);
    array.push(sinonimoMatrix);
    matrix.push(array);
  };
  $scope.showGame = function(){
    try{
      var alternative = '';
      $scope.name = '';
      $scope.id = '';
      var alternatives = [];
      matrix=[];
      //ingresa el la palabra a evaluar y las alternativas
      for (var i = 0; i < $scope.numdata; i++) {
        var random = Math.floor((Math.random()*$scope.vocabulary.length)+1)-1;
        if(i == 0){
          if($scope.contains(words, $scope.vocabulary[random].id)){
            if(vocabularyLength>0){
              i--;
            }else{
              break;
            }
          }else{
            vocabularyLength--;
            words.push($scope.vocabulary[random].id);
            $scope.name =($scope.vocabulary[random].nombre);
            $scope.id =($scope.vocabulary[random].id);
            if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
              alternatives.push($scope.vocabulary[random].id);
              $scope.setMatrix($scope.vocabulary[random].id, $scope.vocabulary[random].sinonimo);
            }
          }
        }else{
            if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
              alternatives.push($scope.vocabulary[random].id);
              $scope.setMatrix($scope.vocabulary[random].id, $scope.vocabulary[random].sinonimo);
            }else{
              i--;
            }
        }
      };
      if(vocabularyLength>=0){
        var card = document.createElement('div');
        card.className ='card'; 
        var voc1 = '<table style="width:100%">'+
                      '<tr style="width:100%; text-align: center; border: 1px solid black;">'+
                        '<div style="width:100%;  text-align: center;"><span id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+$scope.name+'</span></div>'+
                      '</tr>'+
                      '<tr style="width:100%">';
        //desordena las alternativas              
        matrix = matrix.sort(function() {return Math.random() - 0.5});
        //ingresa las alternativas
        for (var i = 0; i < $scope.numdata; i++) {
          alternative = alternative + '<td style="width:33%; text-align: center; border: 1px solid black;"><button ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button></td>';
        };
        var voc2 =    '</tr>'+
                    '</table>';
        //compilar botones ya que ng-click no setea al corer la pagina, 
        //por lo tanto las alteraciones en el DOM no son vistas por este
        var html = card.innerHTML = $compile(voc1 + alternative + voc2)($scope);
        page.empty();
        page.append(html);
        return true;
      }
    }catch(e){
      console.log(e);
      return false;
    }
      
  };


})
.controller('PlaylistCtrl', function($scope) {

})

;
