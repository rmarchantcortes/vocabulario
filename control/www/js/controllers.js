angular.module('starter.controllers', [])
.controller('DescargasCtrl', function($scope, $sce, $http, $state,  $ionicPopup, $window, $ionicLoading, $ionicModal, $timeout, serveLogin) {
 $scope.user = serveLogin.getUser();
  console.log($scope.user);
 if(serveLogin.isLogin()){
    $scope.accountIsVisible = false;
    $scope.pageIsVisible = true;
  }else{
    $scope.accountIsVisible = true;
    $scope.pageIsVisible = false;
  }
  $scope.loginData = {};

  // Create the login modalLogin that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modalLogin) {
    $scope.modalLogin = modalLogin;
  });

  // Triggered in the login modalLogin to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Open the login modalLogin
  $scope.login = function() {
    $scope.modalLogin.show();
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
                  $state.go($state.current, {}, {reload: true});
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
.controller('OrganizationsCtrl', function($scope, $sce, $http, $ionicPopup, $state, $ionicLoading, $ionicModal, $timeout, productService, serveLogin) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //http://www.vocabulario.esy.es/persistirOrganizationsService.php
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.selectOptions =[
    { id: 1 , name: 'Colegio'},
    { id: 2 , name: 'Instituto'},
    { id: 3 , name: 'CFT'},
    { id: 4 , name: 'Preuniversitario'},
    { id: 5 , name: 'Universidad'}];
    $scope.dataForm = {};
  $ionicModal.fromTemplateUrl('templates/newOrganization.html', {
    scope: $scope
  }).then(function(modalNewOrganization) {
    $scope.modalNewOrganization = modalNewOrganization;
  });
  $scope.user = serveLogin.getUser();
  console.log($scope.user);
  console.log(serveLogin.getUser()[0]);
   $scope.organization = {
    nombre : '',
    tipo: '',
    id_persona : serveLogin.getUser()[0]
  };
  
 if(serveLogin.isLogin()){
    $scope.accountIsVisible = false;
    $scope.pageIsVisible = true;
    
  }else{
    $scope.accountIsVisible = true;
    $scope.pageIsVisible = false;
  }
  var urlCompleta ="http://www.vocabulario.esy.es/persistirOrganizationsService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    $http.post(postUrl, $scope.organization)
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
  $scope.loginData = {};
  $scope.newOrganizationData = {'id_persona': serveLogin.getUser()[0]};

  // Create the login modalLogin that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modalLogin) {
    $scope.modalLogin = modalLogin;
  });

  $scope.newOrganization = function(){
    $scope.modalNewOrganization.show();
  };
  $scope.closeNewOrganization = function() {
    $scope.modalNewOrganization.hide();
  };
  $scope.createNewOrganization = function() {
    console.log('Doing new organization', $scope.newOrganizationData);
    $scope.addNewOrganization = {username : '', password : ''};
    var entity = $scope.user;
    var objJSON = JSON.stringify($scope.newOrganizationData);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/InsertNewOrganizationService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log(objJSON);
    $http.post(postUrl, objJSON)
    .then(
    function (response) {
                  $scope.exist = response.data;
                  console.log($scope.exist);
                  $scope.hide($ionicLoading);  
                  $scope.closeNewOrganization();
                  $state.go($state.current, {}, {reload: true});
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                  });
                  $scope.closeLogin();
                }
    );
  }
  // Triggered in the login modalLogin to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Open the login modalLogin
  $scope.login = function() {
    $scope.modalLogin.show();
  };

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  function sendData($scope) {
    
  }
  $scope.show($ionicLoading);
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
                  $state.go($state.current, {}, {reload: true});
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                    });
                  $scope.closeLogin();
                }
    );
  }
    $scope.callToAddToOrganizationList = function(idObj, nameObj){
        productService.addOrganization(idObj, nameObj);
    };
    
  
  
  /*$scope.organization = Organization.all();
  $scope.remove = function(organization) {
    Organization.remove(organization);
  };*/
})

.controller('ClassCtrl', function($scope, $sce, $http, $ionicPopup, $state, $ionicLoading, $ionicModal, $timeout, productService) {
   $scope.Organization = productService.getOrganization();
   $scope.selectOptions =[
    { id: 1 , name: 'Primero Medio'},
    { id: 2 , name: 'Segundo Medio'},
    { id: 3 , name: 'Tercero Medio'},
    { id: 4 , name: 'Cuarto Medio'}];
    $scope.dataForm = {};
  $ionicModal.fromTemplateUrl('templates/newCourse.html', {
    scope: $scope
  }).then(function(modalNewCourse) {
    $scope.modalNewCourse = modalNewCourse;
  });
  $scope.newCourseData = {'id_organizacion': $scope.Organization[0]};
  $scope.newCourse = function(){
    $scope.modalNewCourse.show();
  };
  $scope.closeNewCourse = function() {
    $scope.modalNewCourse.hide();
  };
  $scope.createNewCourse = function() {
    console.log('Doing new Course', $scope.newCourseData);
    var entity = $scope.user;
    var objJSON = JSON.stringify($scope.newCourseData);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/InsertNewCourseService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log(objJSON);
    $http.post(postUrl, objJSON)
    .then(
    function (response) {
                  $scope.exist = response.data;
                  console.log($scope.exist);
                  $scope.hide($ionicLoading);  
                  $scope.closeNewCourse();
                  $state.go($state.current, {}, {reload: true});
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                  });
                  $scope.closeNewCourse();
                }
    );
  }
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

.controller('StudentCtrl', function($scope, $sce, $http, $ionicPopup, $state, $ionicLoading, $ionicModal, $timeout, productService) {
  $scope.Class = productService.getClass();
  $scope.dataForm = {};
  $ionicModal.fromTemplateUrl('templates/newStudent.html', {
    scope: $scope
  }).then(function(modalNewStudent) {
    $scope.modalNewStudent = modalNewStudent;
  });
  $scope.newStudentData = {'id_curso': $scope.Class[0]};
  $scope.newStudent = function(){
    $scope.modalNewStudent.show();
  };
  $scope.closeNewStudent = function() {
    $scope.modalNewStudent.hide();
  };
  $scope.createNewStudent = function() {
    console.log('Doing new Student', $scope.newStudentData);
    var entity = $scope.user;
    var objJSON = JSON.stringify($scope.newStudentData);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/InsertNewStudentService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log(objJSON);
    $http.post(postUrl, objJSON)
    .then(
    function (response) {
                  $scope.exist = response.data;
                  console.log($scope.exist);
                  $scope.hide($ionicLoading);  
                  $scope.closeNewStudent();
                  $state.go($state.current, {}, {reload: true});
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                  });
                  $scope.closeNewStudent();
                }
    );
  }
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

.controller('AccountCtrl', function($scope, $sce, $http, $ionicPopup, $state, $ionicLoading, $ionicModal, $timeout, serveLogin) {
  console.log("account");
  $scope.user = serveLogin.getUser();
  console.log($scope.user);
  var div_account = document.getElementById('account-page');
  var img_account = document.getElementById('account-img');

  if(serveLogin.isLogin()){
    $scope.accountIsVisible = false;
    $scope.pageIsVisible = true;
  }else{
    $scope.accountIsVisible = true;
    $scope.pageIsVisible = false;
  }
  $scope.loginData = {};
    $scope.dataForm = {'id_persona' : $scope.user.id};
  $ionicModal.fromTemplateUrl('templates/editPerson.html', {
    scope: $scope
  }).then(function(modalEditPerson) {
    $scope.modalEditPerson = modalEditPerson;
  });
  $scope.editPersonData = {'id_persona': serveLogin.getUser()[0]};
  console.log($scope.editPersonData);
  $scope.editPerson = function(){
    $scope.modalEditPerson.show();
  };
  $scope.closeEditPerson = function() {
    $scope.modalEditPerson.hide();
  };
  $scope.createEditPerson = function() {
    console.log('Doing Edit person', $scope.editPersonData);
    var entity = $scope.user;
    var objJSON = JSON.stringify($scope.editPersonData);
    // Do the call to a service using $http or directly do the call here
    var urlCompleta ="http://www.vocabulario.esy.es/UpdatePersonService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log(objJSON);
    $http.post(postUrl, objJSON)
    .then(
    function (response) {
                  $scope.exist = response.data;
                  console.log($scope.exist);
                  $scope.hide($ionicLoading);  
                  $scope.closeEditPerson();
                  $state.go($state.current, {}, {reload: true});
                },
                function (){
                  $scope.hide($ionicLoading);  
                  var alertPopup = $ionicPopup.alert({
                        title: 'error al intentar obtener tus datos'
                  });
                  $scope.closeEditPerson();
                }
    );
  }
  // Create the login modalLogin that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modalLogin) {
    $scope.modalLogin = modalLogin;
  });

  // Triggered in the login modalLogin to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Open the login modalLogin
  $scope.login = function() {
    $scope.modalLogin.show();
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
});
