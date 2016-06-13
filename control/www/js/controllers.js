angular.module('starter.controllers', [])
.controller('DescargasCtrl', function($scope, $sce, $http, $ionicPopup, $ionicLoading, $ionicModal, $timeout, serveLogin) {
 
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

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    //screen.lockOrientation('portrait');
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $scope.user = {
      username : '',
      password : ''
    };
    var entity = $scope.user;
    var objJSON = JSON.stringify($scope.loginData);

    $scope.show($ionicLoading);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/persistirLoginService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log(objJSON);
    $http.post(postUrl, objJSON)
    .then(
    function (response) {
                  $scope.exist = response.data;
                  console.log($scope.exist);
                  $scope.hide($ionicLoading);  
                  if($scope.exist.length > 0){
                    serveLogin.setUser($scope.exist[0].id,$scope.exist[0].nombre,$scope.exist[0].apellido);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Saludos '+$scope.exist[0].nombre
                    });
                  }else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'Usuario no encontrado'
                    });
                  }
                  $scope.closeLogin();
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                    });
                  $scope.closeLogin();
                }
    );
    /*$timeout(function() {
      $scope.closeLogin();
    }, 1000);*/
  };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




  console.log("descarga");
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  $http.defaults.headers.post =defaultHTTPHeaders;
  $scope.listOfOptions = ['Nombre', 'Asignatura', 'Fecha'];

/*  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };*/
  $scope.show($ionicLoading);
  $scope.ordenarDescarga = function(selectedItem){
    var urlCompleta = 'http://www.vocabulario.esy.es/persistirDescargasService.php';
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    
    $http.post(postUrl)
    .then(
      function (success) {
        datos=success.data;
        $scope.hide($ionicLoading);  
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
        $scope.hide($ionicLoading);  
        console.log('error al importar contenido');
      }
      );
  };
})
.controller('DashCtrl', function($scope, serveLogin) {
/*var client = mysql.createClient({
  host:'mysql.hostinger.es',
  user:'u295276529_conte',
  password:'chanchan92',
});
client.database = 'u295276529_conte';*/
console.log("tabs");
$scope.myFunctionName = function(){
    if (serveLogin.isLogin()) {
     return "ng-show";
    } else {
     return "ng-hide";
    }
}

})
.controller('OrganizationsCtrl', function($scope, $http, $sce, $ionicPopup, $ionicLoading, productService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //http://www.vocabulario.esy.es/persistirOrganizationsService.php
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  $scope.show($ionicLoading);
    $scope.callToAddToOrganizationList = function(idObj, nameObj){
        productService.addOrganization(idObj, nameObj);
    };
    var urlCompleta ="http://www.vocabulario.esy.es/persistirOrganizationsService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.organizations = response.data;
                  $scope.hide($ionicLoading); 

                },
                function (){
                  console.log('error al importar los datos');
        $scope.hide($ionicLoading); 
      }
                );


  
  /*$scope.organization = Organization.all();
  $scope.remove = function(organization) {
    Organization.remove(organization);
  };*/
})

.controller('ClassCtrl', function($scope, $http, $sce, $ionicPopup, $ionicLoading, productService) {
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  $scope.callToAddToClassList = function(idObj, nameObj){
        productService.addClass(idObj, nameObj);
        console.log(idObj+"===="+nameObj);
    };
  $http.defaults.headers.post =defaultHTTPHeaders;
  $scope.Organization = productService.getOrganization();
  console.log($scope.Organization);
  $scope.curso = {
    nombre : '',
    nivel: '',
    id_organizacion : $scope.Organization[0]
  };

    var urlCompleta ="http://www.vocabulario.esy.es/persistirClassService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $scope.show($ionicLoading);
    $http.post(postUrl, $scope.curso)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.cursos = response.data;
                  $scope.hide($ionicLoading);  
                },
                function (){
                  $scope.hide($ionicLoading);  
                  console.log('Error al importar los Establecimientos');
                }
    );
})

.controller('StudentCtrl', function($scope, $http, $sce, $ionicPopup, $ionicLoading, productService) {
  var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  $http.defaults.headers.post =defaultHTTPHeaders;
  $scope.Class = productService.getClass();
  console.log($scope.Class);
  $scope.estudiante = {
    nombre : '',
    apellido: '',
    nacimiento: '',
    id_curso : $scope.Class[0]
  };
    var urlCompleta ="http://www.vocabulario.esy.es/persistirStudentService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $scope.show($ionicLoading);
    $http.post(postUrl, $scope.estudiante)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.alumnos = response.data;
                  $scope.hide($ionicLoading); 
                },
                function (){
                  $scope.hide($ionicLoading); 
                  console.log('Error al importar las organizaciones');
                }
    );
})

.controller('AccountCtrl', function($scope, serveLogin) {
  console.log("account");
  $scope.user = serveLogin.getUser();
  console.log($scope.user);
  var div_account = document.getElementById('account-page');
  var img_account = document.getElementById('account-img');

  if(serveLogin.isLogin()){
    console.log("if");
    img_account.style.visibility = "hidden";
    div_account.style.visibility = "visible";
  }else{
    console.log("else");
    img_account.style.visibility = "visible";
    div_account.style.visibility = "hidden";

  }
});
