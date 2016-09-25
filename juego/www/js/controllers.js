angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $sce, $http, $state, $ionicPopup, $ionicLoading, $ionicModal, $timeout, serveLogin) {
  $scope.user = serveLogin.getUser();
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
                    serveLogin.setUser($scope.exist[0].id,$scope.exist[0].nombre,$scope.exist[0].apellido,$scope.exist[0].profesor);
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
  };
})

.controller('LevelsCtrl', function($scope, $sce, $http, $ionicPopup, serveData, serveInclude) {
/*     var alertPopup = $ionicPopup.alert({
          title: 'levels'
      });*/

  $scope.levels = [
    { title: 'Nivel 1', id: 1 , name: 'title1', img: 'crayons.jpg', link: 'synonymous'},
    { title: 'Nivel 2', id: 2 , name: 'title2', img: 'libros.jpg', link: 'synonymous'},
    { title: 'Nivel 3', id: 3 , name: 'title3', img: 'letras.jpg', link: 'synonymousAntonym'},
    { title: 'Nivel 4', id: 4 , name: 'title4', img: 'lenguas.png', link: 'synonymous.html'},
    { title: 'Nivel 5', id: 5 , name: 'title5', img: 'idiomas.png', link: 'synonymous.html'},
    { title: 'Nivel 6', id: 6 , name: 'title6', img: 'crucigramas.jpg', link: 'synonymous.html'}
  ];
  $scope.startLevels = function(id) {
    console.log('iniciar: '+id);
    serveInclude.setPage(id);
  };

    $scope.$on('$ionicView.afterEnter', function(){
      var lastLevel = serveData.lastLevel();
      console.log(lastLevel);
      for (var i = 0 ; i<lastLevel; i++) {
        console.log("i: "+i);
        document.getElementById("radtitle"+(i+1)).checked=true;
      }
    });
})

.controller('synonymousAntonymCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin) {
  var page = angular.element(document.getElementById('contenedor'));
  var card = document.createElement('div');
  var words = [];
  var vocabularyLength = 0;
  var matrix = [];
  var times = 0;
  var maxScore = 40;
  $scope.score = 0;
  var successfulGame = false;
  $scope.timer = 100;
  (function update() {
    //$timeout(update, 1000 * 5); 5 segundos
    //$timeout(update, 1000); 1 segundo
    if(!successfulGame){
      if($scope.timer<=0){
        $scope.gameOverForTime();
      }else{
        $timeout(update, 1000);
        $scope.timer -= 1;
        document.getElementById('timer').className = 'col three-dimensions d-normal';
      }
    }
  }());
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
  $scope.pasarNivel= function(id){
    if(successfulGame){
      serveData.setLastLevel(id);
    }
  };
  $scope.gameOverForTime = function(){
    $scope.showAlertPopUp('Juego terminado', 'El tiempo se acabó');
    $scope.setScore();
  };
  $scope.itemSelected= function(id){
    times++;
    if($scope.id==id){
      $scope.score += 10;
      if(vocabularyLength>0 && times<10){
        //$scope.showAlertPopUp('Muy Bien', null);
        document.getElementById('timer').className = 'col three-dimensions d-focus';
        $scope.timer +=2;
        //$scope.timer = 20;
        $scope.showGame();
      }else{
        if(times>=10){
          //$scope.showAlertPopUp('Fallaste', 'Se ha terminado el minijuego');
        }else{
          //$scope.showAlertPopUp('Muy Bien', 'Se acabaron las palabras');
        }
        successfulGame = true;
        $scope.setScore();
      }
    }else{
      $scope.score -= 2;
      if(vocabularyLength>0 && times<10){
        //$scope.showAlertPopUp('Fallaste, intenta en la siguiente', null);
        //$scope.timer=20;
        $scope.showGame();
      }else{
        if(times>=10){
          //$scope.showAlertPopUp('Fallaste', 'Se ha terminado el minijuego');
        }else{
          //$scope.showAlertPopUp('Fallaste', 'Se acabaron las palabras');
        }
        successfulGame = true;
        $scope.setScore();
      }
    }
  };
  $scope.setScore = function(){
    //stop timer
    var userArray = serveLogin.getUser();
    var recount = '<div class="d-card">'+
                    '<div  id="divIcon" class=" d-corner d-corner-off"><i class="icon ion-android-star energized"></i></div>'+
                    '<div class="list card">'+
                      '<div class="item item-avatar">'+
                       '<img src="img/FUUU.png">'+
                        '<h2>'+userArray[1]+'</h2>'+
                        '<p>Sinonimos</p>'+
                      '</div>'+
                      '<div class="item">'+
                        '<i class="icon ion-social-usd">&nbsp; {{score}}</i>'+
                        '<br/>'+
                        '<i class="icon ion-clock">&nbsp;Extra:&nbsp; '+parseInt($scope.timer*0.1)+'</i>'+
                      '</div>'+
                      '<a class="item item-icon-right positive" ui-sref="app.levels" ng-click="pasarNivel('+serveInclude.getNextPage()+')" >'+
                        'Continuar'+
                        '<i class="icon ion-ios-play"></i>'+
                      '</a>'+
                    '</div>'+
                  '</div>';
        card.className ='card'; 
        var scoreHTML = card.innerHTML = $compile(recount)($scope);
        page.empty();
        page.append(scoreHTML);
        document.getElementById('divIcon').className = 'd-corner d-corner-off';
        if($scope.score == maxScore){
          document.getElementById('divIcon').className = 'd-corner d-corner-down';
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
                    case 3:
                      console.log('case 1');
                      $scope.numdata = 3;
                      break;
                    case 4:
                      console.log('case 2');
                      $scope.numdata = 4;
                      break;
                  }
                  if($scope.showGame()==true){
                    $scope.hide($ionicLoading);  
                    $scope.showAlertPopUp('Iniciar juego', 'Preparate!');
                    $scope.timer=100;
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
        card.className ='card'; 
        var voc1 ='<h2 id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+$scope.name+'</h2>';
        //desordena las alternativas              
        matrix = matrix.sort(function() {return Math.random() - 0.5});
        //ingresa las alternativas
        for (var i = 0; i < $scope.numdata; i++) {
          alternative = alternative + '<button class="button button-block button-fix button-balanced" ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button>';
        };
        //compilar botones ya que ng-click no setea al corer la pagina, 
        //por lo tanto las alteraciones en el DOM no son vistas por este
        var html = card.innerHTML = $compile(voc1 + alternative)($scope);
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
.controller('SynonymousCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin) {
  var page = angular.element(document.getElementById('contenedor'));
  var card = document.createElement('div');
  var words = [];
  var vocabularyLength = 0;
  var matrix = [];
  var times = 0;
  var maxScore = 40;
  $scope.score = 0;
  var successfulGame = false;
  $scope.timer = 100;
  (function update() {
    //$timeout(update, 1000 * 5); 5 segundos
    //$timeout(update, 1000); 1 segundo
    if(!successfulGame){
      if($scope.timer<=0){
        $scope.gameOverForTime();
      }else{
        $timeout(update, 1000);
        $scope.timer -= 1;
        document.getElementById('timer').className = 'col three-dimensions d-normal';
      }
    }
  }());
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
  $scope.pasarNivel= function(id){
    if(successfulGame){
      serveData.setLastLevel(id);
    }
  };
  $scope.gameOverForTime = function(){
    $scope.showAlertPopUp('Juego terminado', 'El tiempo se acabó');
    $scope.setScore();
  };
  $scope.itemSelected= function(id){
    times++;
    if($scope.id==id){
      $scope.score += 10;
      if(vocabularyLength>0 && times<10){
        //$scope.showAlertPopUp('Muy Bien', null);
        document.getElementById('timer').className = 'col three-dimensions d-focus';
        $scope.timer +=2;
        //$scope.timer = 20;
        $scope.showGame();
      }else{
        if(times>=10){
          //$scope.showAlertPopUp('Fallaste', 'Se ha terminado el minijuego');
        }else{
          //$scope.showAlertPopUp('Muy Bien', 'Se acabaron las palabras');
        }
        successfulGame = true;
        $scope.setScore();
      }
    }else{
      $scope.score -= 2;
      if(vocabularyLength>0 && times<10){
        //$scope.showAlertPopUp('Fallaste, intenta en la siguiente', null);
        //$scope.timer=20;
        $scope.showGame();
      }else{
        if(times>=10){
          //$scope.showAlertPopUp('Fallaste', 'Se ha terminado el minijuego');
        }else{
          //$scope.showAlertPopUp('Fallaste', 'Se acabaron las palabras');
        }
        successfulGame = true;
        $scope.setScore();
      }
    }
  };
  $scope.setScore = function(){
    //stop timer
    var userArray = serveLogin.getUser();
    var recount = '<div class="d-card">'+
                    '<div  id="divIcon" class=" d-corner d-corner-off"><i class="icon ion-android-star energized"></i></div>'+
                    '<div class="list card">'+
                      '<div class="item item-avatar">'+
                       '<img src="img/FUUU.png">'+
                        '<h2>'+userArray[1]+'</h2>'+
                        '<p>Sinonimos</p>'+
                      '</div>'+
                      '<div class="item">'+
                        '<i class="icon ion-social-usd">&nbsp; {{score}}</i>'+
                        '<br/>'+
                        '<i class="icon ion-clock">&nbsp;Extra:&nbsp; '+parseInt($scope.timer*0.1)+'</i>'+
                      '</div>'+
                      '<a class="item item-icon-right positive" ui-sref="app.levels" ng-click="pasarNivel('+serveInclude.getNextPage()+')" >'+
                        'Continuar'+
                        '<i class="icon ion-ios-play"></i>'+
                      '</a>'+
                    '</div>'+
                  '</div>';
        card.className ='card'; 
        var scoreHTML = card.innerHTML = $compile(recount)($scope);
        page.empty();
        page.append(scoreHTML);
        document.getElementById('divIcon').className = 'd-corner d-corner-off';
        if($scope.score == maxScore){
          document.getElementById('divIcon').className = 'd-corner d-corner-down';
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
                      console.log('case 1');
                      $scope.numdata = 3;
                      break;
                    case 2:
                      console.log('case 2');
                      $scope.numdata = 4;
                      break;
                  }
                  if($scope.showGame()==true){
                    $scope.hide($ionicLoading);  
                    $scope.showAlertPopUp('Iniciar juego', 'Preparate!');
                    $scope.timer=100;
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
        card.className ='card'; 
        var voc1 ='<h2 id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+$scope.name+'</h2>';
        //desordena las alternativas              
        matrix = matrix.sort(function() {return Math.random() - 0.5});
        //ingresa las alternativas
        for (var i = 0; i < $scope.numdata; i++) {
          alternative = alternative + '<button class="button button-block button-fix button-balanced" ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button>';
        };
        //compilar botones ya que ng-click no setea al corer la pagina, 
        //por lo tanto las alteraciones en el DOM no son vistas por este
        var html = card.innerHTML = $compile(voc1 + alternative)($scope);
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
.controller('PlaylistCtrl', function($scope, $rootScope, $state, serveData) {
  //$state.go('app.levels', {cache: false});
  //$rootScope.reload;
  
})
.controller('challengeCtrl', function($scope, $sce, $rootScope, $http, $timeout, $state, $ionicLoading, serveData, productService, serveLogin) {
  $scope.user = serveLogin.getUser();
  console.log($scope.user[3]);
  if(serveLogin.isLogin()){
    $scope.pageAccount = false;
    $scope.pageContent = true;
    if($scope.user[3]==1){
      console.log("if");
      $scope.pageStudent = false;
      $scope.pageTeacher = true;
    }else{
      console.log("else");
      $scope.pageStudent = true;
      $scope.pageTeacher = false;
    }
  }else{
    $scope.pageAccount = true;
    $scope.pageContent = false;
  }
  console.log("account "+$scope.pageAccount);
  console.log("content "+$scope.pageContent);
  console.log("student "+$scope.pageStudent);
  console.log("teacher "+$scope.pageTeacher);
  document.getElementById('spinCourse').style.visibility="hidden";
  document.getElementById('lblCourse').className= "item item-input item-select labelDisabled";
  document.getElementById('comboCourse').disabled=true;
  $scope.selectOptions =[
    { title: 'Nivel 1', id: 1 , name: 'title1', img: 'crayons.jpg', link: 'synonymous'},
    { title: 'Nivel 2', id: 2 , name: 'title2', img: 'libros.jpg', link: 'synonymous'},
    { title: 'Nivel 3', id: 3 , name: 'title3', img: 'letras.jpg', link: 'synonymousAntonym'},
    { title: 'Nivel 4', id: 4 , name: 'title4', img: 'lenguas.png', link: 'synonymous.html'},
    { title: 'Nivel 5', id: 5 , name: 'title5', img: 'idiomas.png', link: 'synonymous.html'},
    { title: 'Nivel 6', id: 6 , name: 'title6', img: 'crucigramas.jpg', link: 'synonymous.html'}];
  $scope.selectedselectedLvl;
  $scope.selectedOrg;
  $scope.selectedCourse;
  $scope.dataForm = { time : '20', start_date: new Date() };

  var timeoutId = null;
  $scope.$watch('dataForm.time', function() {
    console.log('Has changed');
    if(timeoutId !== null) {
      console.log('Ignoring this movement');
      return;
    }
    console.log('Not going to ignore this one');
    timeoutId = $timeout( function() {
      console.log('It changed recently!');
      $timeout.cancel(timeoutId);
      timeoutId = null;
      if($scope.dataForm.time < 10){
        document.getElementById('timeRange').className = 'item range range-assertive';
      }else if($scope.dataForm.time < 25){
        document.getElementById('timeRange').className = 'item range range-energized';
      }else{
        document.getElementById('timeRange').className = 'item range range-balanced';
      }
    }, 100); 
  });
  $scope.callClases = function(Obj){
    
    document.getElementById('lblCourse').className= "item item-input item-select labelEnabled";
    console.log(Obj);
    productService.addOrganization(Obj.id, Obj.nombre);
    console.log(Obj);
    $scope.Organization = productService.getOrganization();
      console.log($scope.Organization[0]);
      $scope.curso = {
        nombre : '',
        nivel: '',
        id_organizacion : $scope.Organization[0]
      };
    var urlCompleta ="http://www.vocabulario.esy.es/persistirClassService.php";
    var postUrl = $sce.trustAsResourceUrl(urlCompleta);
    console.log($scope.curso);
    $http.post(postUrl, $scope.curso)
    .then(
    function (response) {
                  console.log(response.data);
                  $scope.courses = response.data;
                  document.getElementById('spinCourse').style.visibility="hidden";
                  document.getElementById('comboCourse').disabled=false;
                },
                function (){
                  console.log('Error al importar los Cursos');
                  $scope.callToAddToOrganizationList(Obj);
                }
    );
  };
  $scope.callOrganizations = function(){
    if(serveLogin.isLogin()&&$scope.user[3]==1){
      $scope.organizationSend = {
          id_persona : $scope.user[0]
        };
      document.getElementById('spinCourse').style.visibility="visible";
      var urlCompleta ="http://www.vocabulario.esy.es/persistirOrganizationsService.php";
      var postUrl = $sce.trustAsResourceUrl(urlCompleta);
      $http.post(postUrl,$scope.organizationSend)
      .then(
      function (response) {
                    console.log(response.data);
                    $scope.organizations = response.data;
                    
                    document.getElementById('spinOrganizations').style.visibility="hidden";
                    document.getElementById('comboOrganizations').disabled=false;

                    console.log(document.getElementById('comboOrganizations').className);
                    /*$scope.hide($ionicLoading); */

                  },
                  function (){
                    console.log('error al importar los datos');
          /*$scope.hide($ionicLoading); */
        }
      );
    }
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
  $scope.createActibity = function(data){
    console.log("data");
    if(data.time!=null&&data.selectedCourse!=null&&data.selectedOrg!=null&&data.selectedLvl!=null&&data.end_date!=null){
      $scope.show($ionicLoading);  
      
      var entity = {nombre: data.name, nivel:data.selectedLvl.id, tiempo: data.time, fecha_inicio: data.start_date, fecha_fin: data.end_date, id_curso: data.selectedCourse.id};
      var objJSON = JSON.stringify(entity);
      // Do the call to a service using $http or directly do the call here

      var urlCompleta ="http://www.vocabulario.esy.es/InsertNewChallengeService.php";
      var postUrl = $sce.trustAsResourceUrl(urlCompleta);
      console.log(objJSON);
      $http.post(postUrl, objJSON)
      .then(
      function (response) {
                    console.log("entró");
                    $scope.exist = response.data;
                    console.log($scope.exist);
                    $scope.hide($ionicLoading);  
                    $state.go('app.levels', {}, {reload: true});
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
  }
  $scope.Organization = productService.getOrganization();
  console.log($scope.Organization);
  $scope.curso = {
    nombre : '',
    nivel: '',
    id_organizacion : $scope.Organization[0]
  };
    
});
