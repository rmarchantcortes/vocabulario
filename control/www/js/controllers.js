angular.module('starter.controllers', [])
.controller('DescargasCtrl', function($scope, $http, $sce) {
  console.log("descarga");
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
.controller('OrganizationsCtrl', function($scope, $http, $sce) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //http://www.vocabulario.esy.es/persistirOrganizationsService.php
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    var urlCompleta ="http://www.vocabulario.esy.es/persistirOrganizationsService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.organizations = response.data;
                  organizations= $scope.organizations;
                },
                function (){
        alert('Error al importar las organizaciones');
      }
                );


  
  /*$scope.organization = Organization.all();
  $scope.remove = function(organization) {
    Organization.remove(organization);
  };*/
})

.controller('ClassCtrl', function($scope, $http, $sce, $stateParams, Organizations) {
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  $http.defaults.headers.post =defaultHTTPHeaders;
  console.log(organizations);
  $scope.cursos = {
    idOrg : Organizations.get($stateParams.organizationId, organizations)
  };
    var urlCompleta ="http://www.vocabulario.esy.es/persistirClassService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.cursos = response.data;
                  clases = $scope.cursos;
                },
                function (){
        alert('Error al importar las organizaciones');
      }
                );
})

.controller('StudentCtrl', function($scope, $http, $sce, $stateParams, Class) {
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  $http.defaults.headers.post =defaultHTTPHeaders;
  console.log(clases);
  $scope.alumnos = {
    idOrg : Clases.get($stateParams.classId, clases)
  };
    var urlCompleta ="http://www.vocabulario.esy.es/persistirStudentService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.alumnos = response.data;
                },
                function (){
        alert('Error al importar las organizaciones');
      }
                );
})

.controller('AccountCtrl', function($scope) {
  console.log("account");
  $scope.settings = {
    enableFriends: true
  };
});
