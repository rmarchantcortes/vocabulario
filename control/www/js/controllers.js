angular.module('starter.controllers', [])
.controller('DescargasCtrl', function($scope, $http, $sce) {
  $scope.showApp = function() {
    console.log("asdasdasd");
  };
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  $http.defaults.headers.post =defaultHTTPHeaders;

  $scope.descargas = 
  {
    orden : ''
  };
  $scope.seleccionarDescarga = function(){
    var urlCompleta = 'http://www.vocabulario.esy.es/persistirDescargasService.php';
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl, $scope.descargas)
    .then(
      function (success) {
        datos=success.data;
        document.getElementById('contenedor').innerHTML = '';
        for (var i = 0; i < datos.length; i++) {
          var card = document.createElement('div');
          card.className ='card'; 
          card.innerHTML =  '<ion-card>'+
                              '<ion-item>'+
                              '<a class="item item-avatar" href="#" onClick="window.open(\''+datos[i][4]+'\', \'_blank\')">'+
                                '<img src="'+datos[i][3]+'" >'+
                                '<h2><b>'+datos[i][0]+'</b></h2>'+
                                '<p><b>'+datos[i][5]+'</b></p>'+
                                '<p><b> Asignatura:</b> '+datos[i][1]+'</p>'+
                                '<p><b> Curso:</b> '+datos[i][2]+'</p>'+
                              '</a>'+
                              '</ion-item>'+
                            '</ion-card>';
                                     // Append the text to <li>
          document.getElementById('contenedor').appendChild(card);
          //document.getElementById('contenedor').innerHTML = '<p>'+datos[i][0]+'</P>';
        };
        

        
      },
      function (){
        alert('Error al importar el contenido');
      }
      );
  };
   
})
.controller('DashCtrl', function($scope) {
/*var client = mysql.createClient({
  host:'mysql.hostinger.es',
  user:'u295276529_conte',
  password:'chanchan92',
});
client.database = 'u295276529_conte';*/

})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
