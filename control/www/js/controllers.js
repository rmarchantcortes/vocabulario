angular.module('starter.controllers', [])
.controller('DescargasCtrl', function($scope, $http, $sce) {
  console.log("descarga");
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  $http.defaults.headers.post =defaultHTTPHeaders;
  $scope.listOfOptions = ['Nombre', 'Asignatura', 'Fecha'];
  $scope.ordenarDescarga = function(selectedItem){
    var urlCompleta = 'http://www.vocabulario.esy.es/persistirDescargasService.php';
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    
    $http.post(postUrl, $scope.descargas)
    .then(
      function (success) {
        datos=success.data;
        console.log(datos);
        //datos.sort(nombre);
        if(selectedItem=="Asignatura"){
           datos=datos.sort(function(a,b) { return (a.asignatura > b.asignatura) ? 1 : ((b.asignatura > a.asignatura) ? -1 : 0);});
        }else if(selectedItem=="Fecha"){
           datos=datos.sort(function(a,b) { return (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0);});
        }else{
           datos=datos.sort(function(a,b) { return (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0);});
        }
       
        document.getElementById('contenedor').innerHTML = '';
        for (var i = 0; i < datos.length; i++) {
          var card = document.createElement('div');
          card.className ='card'; 
          card.innerHTML =  '<ion-card>'+
                              '<ion-item>'+
                              '<a class="item item-avatar" href="#" onClick="window.open(\''+datos[i].linkapp+'\', \'_blank\')">'+
                                '<img src="'+datos[i].imagen+'" >'+
                                '<h2><b>'+datos[i].nombre+'</b></h2>'+
                                '<p><b>'+datos[i].fecha+'</b></p>'+
                                '<p><b> Asignatura:</b> '+datos[i].asignatura+'</p>'+
                                '<p><b> Curso:</b> '+datos[i].curso+'</p>'+
                              '</a>'+
                              '</ion-item>'+
                            '</ion-card>';
          document.getElementById('contenedor').appendChild(card);
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
