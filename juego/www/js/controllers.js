angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $sce, $http, $state, $ionicPopup, $ionicLoading, $ionicModal, $timeout, serveLogin) {
	$scope.user = serveLogin.getUser();
	$scope.loginData = {};
	$scope.trying = 0;
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
					serveLogin.setUser($scope.exist[0].id,$scope.exist[0].nombre,$scope.exist[0].apellido,$scope.exist[0].profesor,$scope.exist[0].id_curso);
					console.log(serveLogin.getUser());
					var alertPopup = $ionicPopup.alert({
						title: 'Saludos '+$scope.exist[0].nombre
					});
				}else{
					var alertPopup = $ionicPopup.alert({
						title: 'Usuario no encontrado'
					});
				}
				$scope.closeLogin();
				/*$state.go($state.current, {}, {reload: true});*/
				$state.go('app.levels', {}, {reload: true});
			},
			function (){
				if($scope.trying==0){
					$scope.doLogin();
					$scope.trying +=1;
				}else{
					$scope.trying=0;
					$scope.hide($ionicLoading);  
					var alertPopup = $ionicPopup.alert({
						title: 'error al intentar obtener tus datos'
					});
					$scope.closeLogin();
				}
				
			}
		);
	};
})







.controller('LevelsCtrl', function($scope, $sce, $http, $ionicPopup, serveData, serveInclude, viewService, serveLevel) {
	viewService.setView('LevelsCtrl');
	$scope.levels = [
		{ title: 'Nivel 1', id: 1 , name: 'title1', ctl: 'MissingWordCtrl', alt: 3, img: 'Icon-level-01.png', link: 'missingWord', description: 'Rellena el espacio faltante'},
		{ title: 'Nivel 2', id: 2 , name: 'title2', ctl: 'MissingWordCtrl', alt: 4, img: 'Icon-level-02.png', link: 'missingWord', description: 'Rellena el espacio faltante'},
		{ title: 'Nivel 3', id: 3 , name: 'title3', ctl: 'ReplaceWordCtrl', alt: 3, img: 'Icon-level-03.png', link: 'replaceWord', description: 'Busca un sinónimo'},
		{ title: 'Nivel 4', id: 4 , name: 'title4', ctl: 'WordIdentifierCtrl', alt: 3, img: 'Icon-level-04.png', link: 'wordIdentifier', description: 'Sinonimos o Antonimos en una oración'},
		{ title: 'Nivel 5', id: 5 , name: 'title5', ctl: 'TermsCoupletsCtrl', alt: 3, img: 'Icon-level-05.png', link: 'termsCouplets', description: 'Sinonimos 3 alternativas'},
		{ title: 'Nivel 6', id: 6 , name: 'title6', ctl: 'DoubleReplaceWordCtrl', alt: 3, img: 'Icon-level-06.png', link: 'doubleReplaceWord', description: 'Sinonimos 3 alternativas'}
	];
	$scope.startLevels = function(id) {
		console.log('iniciar: '+id);
		serveInclude.setPage(id);
		angular.forEach($scope.levels, function(value, key) {
			if(id == value.id){
				serveLevel.setLevelParam(value.ctl, value.alt, false);
			}
		});
	};

	$scope.$on('$ionicView.afterEnter', function(){
		var lastLevel = serveData.lastLevel();
		console.log(lastLevel);
		for (var i = 0 ; i<lastLevel; i++) {
			console.log("i: "+i);
			document.getElementById("radtitle"+(i+1)).checked=true;
			if(i==(lastLevel-1)){
				console.log("if comment:  "+"comment"+(i+1));
				document.getElementById("comment"+(i+1)).disabled="disabled";
			}
		}
	});
})







.controller('commentsCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $state, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService) {
	viewService.setView('commentsCtrl');
	$scope.sendComment = {
		nivel : serveInclude.getPage(),
		id_persona : serveLogin.getUser()[0]
	};
	$scope.callComments = function() {
		// Start showing the progress
		console.log(serveInclude.getPage());
		var objJSON = {nivel:serveInclude.getPage()};
		$scope.show($ionicLoading);
		// Do the call to a service using $http or directly do the call here
		var urlCompleta ="http://www.vocabulario.esy.es/persistirCommentsService.php";
		var postUrl = $sce.trustAsResourceUrl(urlCompleta);
		$http.post(postUrl, objJSON)
		.then(
			function (response) {
				$scope.comments = response.data;
				$scope.hide($ionicLoading);  
			},
			function (){
				$scope.hide($ionicLoading);  
				$scope.showAlertPopUp('Error', 'No se han podido importar los comentarios');
				$state.go('app.levels', {}, {reload: true});
			}
		);
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
	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	$scope.insertComment = function(){
		if(serveLogin.isLogin()){
			
			var objJSON = JSON.stringify($scope.sendComment);
			$scope.show($ionicLoading);
			// Do the call to a service using $http or directly do the call here
			var urlCompleta ="http://www.vocabulario.esy.es/InsertNewCommentService.php";
			var postUrl = $sce.trustAsResourceUrl(urlCompleta);
			console.log($scope.user);

			$http.post(postUrl, objJSON)
			.then(
				function (response) {
					$scope.exist = response.data;
					$scope.hide($ionicLoading);
					$state.go($state.current, {}, {reload: true});
				},
				function (){
					$scope.hide($ionicLoading);  
					var alertPopup = $ionicPopup.alert({
						title: 'error al intentar guardar tu comentario'
					});s
				}
			);
		}else{
			var alertPopup = $ionicPopup.alert({
				title: 'Necesitas iniciar sesión para comentar'
			});
		}
	};
})







.controller('TermsCoupletsCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, $state, $timeout, serveInclude, serveData, serveLogin, viewService) {
	viewService.setView('TermsCoupletsCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var matrixQuestion = [];
	var matrixAnswer = [];
	var times = 0;
	var selectDiv =0;
	var selectSide = 0;
	var maxScore = 40;
	var item = 0;
	var previousDiv = [];
	$scope.peerDiv = [];
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='TermsCoupletsCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='TermsCoupletsCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
			}
		}
		
	}());
	$scope.colors = [
						[1,'green'],
						[2,'red'],
						[3,'yellow'],
						[4,'blue'],
					];
	$scope.usedColors = [];
	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	$scope.loadBefore = function() {
		$scope.show($ionicLoading);
		var urlCompleta ="http://www.vocabulario.esy.es/persistirVocabularyService.php";
		var postUrl = $sce.trustAsResourceUrl(urlCompleta);
		$http.post(postUrl)
		.then(
			function (response) {
				$scope.vocabulary = response.data;
				vocabularyLength = $scope.vocabulary.length;
				console.log(vocabularyLength);
				switch(serveInclude.getPage()){
					case 4:
						console.log('case 1');
						$scope.numdata = 3;
						break;
					case 5:
						console.log('case 2');
						$scope.numdata = 4;
						break;
				}
				if($scope.showGame()==true){
					$scope.hide($ionicLoading);
					$scope.showAlertPopUp('Terminos Pareados', 'Intrucciones: Debes emparejar las palabras con su respectivo significado, clickea sobre ellos para asignarle un color, los cuadros con el mismo color estarán emparejados. Si te equivocas vuelve a clickear sobre el cuadro y se borrará el cuadro seleccionado y el cuadro emparejado', true);
					$scope.timer=20;
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
			}
		);
	};
	$scope.showGame = function(){
		//$scope.availableColors = $scope.colors;
		$scope.availableColors = angular.copy($scope.colors);
		//try{
			var alternative = '';
			$scope.name = '';
			$scope.id = '';
			var alternatives = [];
			matrixQuestion = [];
			matrixAnswer = [];
			//ingresa el la palabra a evaluar y las alternativas
			console.log($scope.vocabulary);
			for (var i = 0; i < $scope.numdata; i++) {
				var random = Math.floor((Math.random()*$scope.vocabulary.length)+1)-1;
				if(i == 0){
					//pregunta por si en iteraciones anteriores ya salió la palabra
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
						console.log("no esta repetido");
						if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
							console.log("no está en las alternativas");
							alternatives.push($scope.vocabulary[random].id);
							$scope.setMatrixAnswer($scope.vocabulary[random].id, $scope.vocabulary[random].definicion);
							$scope.setMatrixQuestion($scope.vocabulary[random].id, $scope.vocabulary[random].nombre);
						}
					}
				}else{
					if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
						alternatives.push($scope.vocabulary[random].id);
						$scope.setMatrixAnswer($scope.vocabulary[random].id, $scope.vocabulary[random].definicion);
						$scope.setMatrixQuestion($scope.vocabulary[random].id, $scope.vocabulary[random].nombre);
					}else{
						i--;
					}
				}
			};
			if(vocabularyLength>=0){
				card.className ='card'; 
				//desordena las alternativas       
				matrixAnswer = matrixAnswer.sort(function() {return Math.random() - 0.5});       
				matrixQuestion = matrixQuestion.sort(function() {return Math.random() - 0.5});
				console.log(matrixQuestion);
				console.log(matrixAnswer);
				var openDiv = '<div class="terms-div">';
				for (var i = 0; i < $scope.numdata; i++) {
					if(i==($scope.numdata-1)){
						alternative =	alternative+'<div class="row terms-row">'+
										'<div id="Q'+matrixQuestion[i][0]+'" ng-click="itemSelected(\'Q'+matrixQuestion[i][0]+'\', 1)" class="col terms-light-bottom terms-left" >'+matrixQuestion[i][1]+'</div>'+
										'<div id="A'+matrixAnswer[i][0]+'" ng-click="itemSelected(\'A'+matrixAnswer[i][0]+'\', 2)" class="col terms-light-bottom" >'+matrixAnswer[i][1]+'</div>'+
									'</div>';
					}else{
						alternative =	alternative+'<div class="row terms-row">'+
										'<div id="Q'+matrixQuestion[i][0]+'" ng-click="itemSelected(\'Q'+matrixQuestion[i][0]+'\', 1)" class="col terms-light terms-left" >'+matrixQuestion[i][1]+'</div>'+
										'<div id="A'+matrixAnswer[i][0]+'" ng-click="itemSelected(\'A'+matrixAnswer[i][0]+'\', 2)" class="col terms-light" >'+matrixAnswer[i][1]+'</div>'+
									'</div>';
					}
				};
				var closeDiv = '</div>';
				
				//compilar botones ya que ng-click no setea al correr la pagina, 
				//por lo tanto las alteraciones en el DOM no son vistas por este
				/*var html = card.innerHTML = $compile(alternative)($scope);*/
				var html = card.innerHTML = $compile(openDiv+alternative+closeDiv)($scope);
				page.empty();
				page.append(html);
				return true;
			}
		/*}catch(e){
			console.log(e);
			return false;
		}*/
	};
	$scope.contains = function(Array, element) {
		for (var i = 0; i < Array.length; i++) {
			if (Array[i] == element) {
				return true;
			}
		}
		return false;
	}
	$scope.setMatrixQuestion = function(idMatrix, sinonimoMatrix){
		var array=[];
		array.push(idMatrix);
		array.push(sinonimoMatrix);
		matrixQuestion.push(array);
	};
	$scope.setMatrixAnswer = function(idMatrix, sinonimoMatrix){
		var array=[];
		array.push(idMatrix);
		array.push(sinonimoMatrix);
		matrixAnswer.push(array);
	};
	$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
			});
		}
	};
	$scope.nextTable = function(id){
		times++;
		if($scope.answer==id){
			$scope.score += 10;
			if(vocabularyLength>0 && times<10){
				//$scope.showAlertPopUp('Muy Bien', null);
				$scope.timer = 20;
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
				$scope.timer=20;
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
	}
	$scope.itemSelected= function(id, side){
		console.log("ITEM SELECTED: "+id+", "+side);
		var clearItem = false;
		for (var i = previousDiv.length - 1; i >= 0; i--) {
			if($scope.contains(previousDiv, id)){
				$scope.restoreColor(id);
				var index = previousDiv.indexOf(id);
				if (index > -1) {
					previousDiv.splice(index, 1);
				}
				if($scope.getPeerId(id)>=0){
					$scope.restoreColor($scope.getPeerId(id));
					var index = previousDiv.indexOf($scope.getPeerId(id));
					if (index > -1) {
						previousDiv.splice(index, 1);
					}
				}
				clearItem = true;
				selectSide=0;
			}
		};
		if(!clearItem){
			if(previousDiv.length%2==0){
				console.log("par"+previousDiv.length);
				selectSide=side;
				$scope.paintBackgroundDiv(id,$scope.getColor(id));
			}else{
				console.log("inpar"+previousDiv.length);
				if(selectSide==side){
					console.log("inpar if");
					$scope.restoreColor(previousDiv[previousDiv.length-1]);
					$scope.paintBackgroundDiv(id,$scope.getColor(id));
				}else{
					console.log("inpar else");
					selectSide=side;
					var array = [];
					console.log(previousDiv);
					console.log(previousDiv[previousDiv.length-1]+", "+id);
					array.push(previousDiv[previousDiv.length-1]);
					array.push(id);
					$scope.peerDiv.push(array);
					$scope.paintBackgroundDiv(id,$scope.getColor(id));
				}
			}

		}
		console.log("::::::::::::ITEM SELECTED::::::::::");
	};
	$scope.getPeerId= function(id){
		console.log("GET PEER ID: "+id);
		console.log($scope.peerDiv);
		if($scope.peerDiv != null){
			for (var i = $scope.peerDiv.length - 1; i >= 0; i--) {
				if($scope.peerDiv[i][0] == id){
					console.log("peer: "+$scope.peerDiv[i][1]);
					return $scope.peerDiv[i][1];
				}else if($scope.peerDiv[i][1] == id){
					console.log("peer: "+$scope.peerDiv[i][0]);
					return $scope.peerDiv[i][0];
				}
			};
			return -1;
		}else{
			return -1;
		}
		console.log("::::::::::::GET PEER ID::::::::::");
	}
	$scope.getColor= function(id){
		console.log("GET COLOR: "+id);
		console.log($scope.usedColors);
		if($scope.usedColors.length > 0){
			for (var i = 0; i < $scope.usedColors.length; i++) {
				var peer = $scope.getPeerId(id);
				console.log("PEER: "+peer);
				console.log("PEER: "+$scope.usedColors[i][0]);
				if($scope.usedColors[i][0] == peer){
					console.log("if = res: "+$scope.usedColors[i][1]);
					return $scope.usedColors[i][1];
				}
			};

			console.log(angular.copy($scope.availableColors));
			console.log(angular.copy($scope.availableColors.length));
			if($scope.availableColors.length==1){
				var randomColor = 0;
			}else{
				var randomColor = Math.floor((Math.random() * ($scope.availableColors.length-1)) + 1);
			}
			
			console.log(randomColor);
			var res = $scope.availableColors[randomColor][0];
			var index = $scope.availableColors.indexOf($scope.availableColors[randomColor]);
			if (index > -1) {
				$scope.availableColors.splice(index, 1);
			}
			console.log(angular.copy($scope.availableColors));
			var array = [];
			array.push(id);
			array.push(res);
			$scope.usedColors.push(array);
			console.log("else if = res: "+res);
			return res;
		}else{
			console.log(angular.copy($scope.availableColors));
			if($scope.availableColors.length==1){
				var randomColor = 0;
			}else{
				var randomColor = Math.floor((Math.random() * ($scope.availableColors.length-1)) + 1);
			}
			console.log("random: "+randomColor+", colors: "+$scope.availableColors);
			var res = $scope.availableColors[randomColor][0];
			var index = $scope.availableColors.indexOf($scope.availableColors[randomColor]);
			if (index > -1) {
				$scope.availableColors.splice(index, 1);
			}
			console.log(angular.copy($scope.availableColors));
			var array = [];
					array.push(id);
					array.push(res);
			$scope.usedColors.push(array);
			console.log("else = res: "+res);
			return res;
		}
		console.log("::::::::::::GET COLOR::::::::::");
	}
	$scope.setColor= function(idElement, idColor){
		console.log("SET COLOR: "+idElement+", "+idColor);
		var array = [];
		array.push(idElement);
		array.push(idColor);
		$scope.availableColors.push(array);
		console.log("::::::::::::SET COLOR::::::::::");
	}
	$scope.restoreColor= function(id){
		console.log("RESTORE COLOR: "+id);
		for (var i = 0; i < $scope.usedColors.length; i++) {
			if($scope.usedColors[i][0]==id){
				var index = $scope.usedColors.indexOf($scope.usedColors[i]);
				if (index > -1) {
					$scope.usedColors.splice(index, 1);
				}
				for (var j = 0; j < $scope.colors.length; j++) {
					if($scope.usedColors[i][1]==j){
						$scope.availableColors.push($scope.colors[j]);
					}
				};
				
			}
		};
		document.getElementById(id).style = "background-color: initial;";
		console.log("::::::::::::RESTORE COLOR::::::::::");
	}
	$scope.paintBackgroundDiv= function(id, color){
		console.log("PAINT BACKGROUND DIV: "+id+", "+color);
		for (var i = $scope.colors.length - 1; i >= 0; i--) {
			//console.log("for: "+$scope.colors[i][0]+", "+color);
			if($scope.colors[i][0]==color){
				document.getElementById(id).style = "background-color: "+$scope.colors[i][1]+";";
				previousDiv.push(id);
				console.log(previousDiv);
			}
		};
		console.log("::::::::::::PAINT BACKGROUND DIV::::::::::");
	}
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
	$scope.gameOverForTime = function(){
		$scope.showAlertPopUp('Juego terminado', 'El tiempo se acabó');
		$scope.setScore();
	};
	$scope.contains = function(Array, element) {
		for (var i = 0; i < Array.length; i++) {
			if (Array[i] == element) {
				return true;
			}
		}
		return false;
	};
	$scope.pasarNivel= function(id){
		if(successfulGame){
			serveData.setLastLevel(id);
		}
	};
})







.controller('WordIdentifierCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, $state, $timeout, serveInclude, serveData, serveLogin, viewService) {
	viewService.setView('WordIdentifierCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var times = 0;
	var maxScore = 40;
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='WordIdentifierCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='WordIdentifierCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
			}
		}
		
	}());
	$scope.levels = [
		{ title: 'Nivel 1', id: 1 , name: 'title1', img: 'Icon-level-01.png', link: 'synonymous', description: 'Sinonimos 3 alternativas'},
		{ title: 'Nivel 2', id: 2 , name: 'title2', img: 'Icon-level-02.png', link: 'synonymous', description: 'Sinonimos 4 alternativas'},
		{ title: 'Nivel 3', id: 3 , name: 'title3', img: 'Icon-level-03.png', link: 'synonymousAntonym', description: 'Sinonimos 3 alternativas'},
		{ title: 'Nivel 4', id: 4 , name: 'title4', img: 'Icon-level-04.png', link: 'wordIdentifier', description: 'Sinonimos o Antonimos en una oración'},
		{ title: 'Nivel 5', id: 5 , name: 'title5', img: 'Icon-level-05.png', link: 'synonymous.html', description: 'Sinonimos 3 alternativas'},
		{ title: 'Nivel 6', id: 6 , name: 'title6', img: 'Icon-level-06.png', link: 'synonymous.html', description: 'Sinonimos 3 alternativas'}
	];
	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	$scope.loadBefore = function() {
		$scope.show($ionicLoading);
		var urlCompleta ="http://www.vocabulario.esy.es/persistirVocabularyService.php";
		var postUrl = $sce.trustAsResourceUrl(urlCompleta);
		$http.post(postUrl)
		.then(
			function (response) {
				$scope.vocabulary = response.data;
				vocabularyLength = $scope.vocabulary.length;
				console.log(vocabularyLength);
				/*switch(serveInclude.getPage()){
					case 3:
						console.log('case 1');
						$scope.numdata = 3;
						break;
					case 4:
						console.log('case 2');
						$scope.numdata = 4;
						break;
				}*/
				if($scope.showGame()==true){
					$scope.hide($ionicLoading);
					$scope.showAlertPopUp('Identifica la palabra', 'Intrucciones: Se presentará una palabra y un texto con otra palabra resaltada, debes identificar si estas palabras son sinónimos o antónimos', true);
					$scope.timer=20;
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
			}
		);
	};
	$scope.showGame = function(){
		try{
			var alternative = '';
			$scope.name = '';
			$scope.id = '';
			var alternatives = [];
			matrix=[];
			//ingresa el la palabra a evaluar y las alternativas
			console.log($scope.vocabulary);
			for (var i = 0; i < 1; i++) {
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
						console.log($scope.vocabulary[random]);
						words.push($scope.vocabulary[random].id);
						var name =($scope.vocabulary[random].nombre);
						
						var randomItem = Math.floor((Math.random()*1));
						console.log(randomItem);
						if(randomItem==1){
							var text =($scope.vocabulary[random].texto_sinonimo);
							text = text.replace($scope.vocabulary[random].sinonimo, $scope.vocabulary[random].sinonimo.toLowerCase());
							text = text.replace($scope.vocabulary[random].sinonimo.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
							$scope.answer=1;
						}else{
							if($scope.vocabulary[random].texto_antonimo.length>0){
								var text =($scope.vocabulary[random].texto_antonimo);
								text = text.replace($scope.vocabulary[random].antonimo, $scope.vocabulary[random].antonimo.toLowerCase());
								text = text.replace($scope.vocabulary[random].antonimo.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
								$scope.answer=0;
							}else{
								var text =($scope.vocabulary[random].texto_sinonimo);
								text = text.replace($scope.vocabulary[random].sinonimo, $scope.vocabulary[random].sinonimo.toLowerCase());
								text = text.replace($scope.vocabulary[random].sinonimo.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
								$scope.answer=1;
							}
						}
						
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
				var voc1 ='<h2 id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+name+'</h2>';
				var text = '<span>'+text+'</span>'
				//desordena las alternativas              
				matrix = matrix.sort(function() {return Math.random() - 0.5});
				alternative = '<button class="button button-block button-fix button-balanced" ng-click="itemSelected(1)" id="1" name="alternative_sin"  style="width:90%;">Sinonimo</button>'+
							  '<button class="button button-block button-fix button-balanced" ng-click="itemSelected(0)" id="0" name="alternative_ant"  style="width:90%;">Antonimo</button>';
				
				//compilar botones ya que ng-click no setea al correr la pagina, 
				//por lo tanto las alteraciones en el DOM no son vistas por este
				var html = card.innerHTML = $compile(voc1 + text +alternative)($scope);
				page.empty();
				page.append(html);
				return true;
			}
		}catch(e){
			console.log(e);
			return false;
		}
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
	$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
			});
		}
	};
	$scope.itemSelected= function(id){
		times++;
		if($scope.answer==id){
			$scope.score += 10;
			if(vocabularyLength>0 && times<10){
				//$scope.showAlertPopUp('Muy Bien', null);
				$scope.timer = 20;
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
				$scope.timer=20;
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
		$scope.timer = 20;
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
	$scope.gameOverForTime = function(){
		$scope.showAlertPopUp('Juego terminado', 'El tiempo se acabó');
		$scope.setScore();
	};
	$scope.pasarNivel= function(id){
		if(successfulGame){
			serveData.setLastLevel(id);
		}
	};
})









.controller('synonymousAntonymCtrl', function($scope, $http, $sce, $ionicLoading, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService) {
	viewService.setView('synonymousAntonymCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var vocabularyLength = 0;
	var matrix = [];
	var times = 0;
	var maxScore = 40;
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='synonymousAntonymCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='synonymousAntonymCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
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
	$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
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
				$scope.timer = 20;
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
				$scope.timer=20;
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
					$scope.showAlertPopUp('Sinónimos y antónimos', 'Intrucciones: debes identificar si la palabra expuesta es sinónimo ó antónimo con alguna de las alternativas, recuerda puede ser un sinónimo ó un antónimo!', true);
					$scope.timer=20;
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
				}
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
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
				//compilar botones ya que ng-click no setea al correr la pagina, 
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








.controller('MissingWordCtrl', function($scope, $http, $sce, $ionicLoading, $state, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService, serveLevel) {
	viewService.setView('MissingWordCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var vocabularyLength = 0;
	var matrix = [];
	var times = 0;
	var maxScore = 40;
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='MissingWordCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='MissingWordCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
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
	};$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
			});
		}
	};
	$scope.pasarNivel= function(id){
		if(successfulGame){
			serveData.setLastLevel(id);
			if(serveLogin.isLogin()){
				$scope.show($ionicLoading);
				$scope.scoreSend = {puntaje:$scope.score, fecha: new Date(), id_persona: parseInt(serveLogin.getUser()[0]),id_desafio: serveLevel.idChallenge(),id_juego:1};
				console.log($scope.scoreSend);
				var objJSON = JSON.stringify($scope.scoreSend);
				var urlCompleta ="http://www.vocabulario.esy.es/InsertScoreService.php";
				var postUrl = $sce.trustAsResourceUrl(urlCompleta);
				$http.post(postUrl, objJSON)
				.then(
					function (response) {
						$scope.vocabulary = response.data;
						$scope.hide($ionicLoading);  
					},
					function (){
						if($scope.trying==0){
							$scope.loadBefore();
							$scope.trying = $scope.trying+1;
						}else{
							$scope.hide($ionicLoading);  
							$scope.showAlertPopUp('Error', 'No se han podido guardar los datos');
							$state.go('app.levels', {}, {reload: true});
						}
					}
				);
			}
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
				$scope.timer = 20;
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
				$scope.timer=20;
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
				if(serveLevel.isLevel('MissingWordCtrl')){
					$scope.numdata = serveLevel.getLevelParam();
					if($scope.showGame()==true){
						$scope.hide($ionicLoading);
						$scope.showAlertPopUp('Palabra faltante', 'Intrucciones: selecciona la palabra que encaja de mejor forma en el espacio faltante del texto', true);
						$scope.timer=20;
					}else{
						$scope.hide($ionicLoading); 
						$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
						$state.go('app.levels', {}, {reload: true});
					}
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
				/*switch(serveInclude.getPage()){
					case 1:
						console.log('case 1');
						$scope.numdata = 3;
						break;
					case 2:
						console.log('case 2');
						$scope.numdata = 4;
						break;
				}*/
				
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
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
						console.log($scope.vocabulary[random].nombre);

						var name =($scope.vocabulary[random].texto_ejemplo);
						name = name.replace($scope.vocabulary[random].nombre, $scope.vocabulary[random].nombre.toLowerCase());
						name = name.replace($scope.vocabulary[random].nombre.toLowerCase(), "__________");
						/*var start = name.toLowerCase().indexOf($scope.vocabulary[random].nombre.toLowerCase());
						var end = name.toLowerCase().indexOf(" ", start);*/

						/*console.log("indexof: "+start+" to "+end);*/
						$scope.id =($scope.vocabulary[random].id);
						if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
							alternatives.push($scope.vocabulary[random].id);
							$scope.setMatrix($scope.vocabulary[random].id, $scope.vocabulary[random].nombre);
						}
					}
				}else{
					if(!$scope.contains(alternatives, $scope.vocabulary[random].id)){
						alternatives.push($scope.vocabulary[random].id);
						$scope.setMatrix($scope.vocabulary[random].id, $scope.vocabulary[random].nombre);
					}else{
						i--;
					}
				}
			};
			if(vocabularyLength>=0){
				card.className ='card'; 
				var voc1 ='<p id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+name+'</p>';
				//desordena las alternativas              
				matrix = matrix.sort(function() {return Math.random() - 0.5});
				//ingresa las alternativas
				for (var i = 0; i < $scope.numdata; i++) {
					alternative = alternative + '<button class="button button-block button-fix button-balanced" ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button>';
				};
				//compilar botones ya que ng-click no setea al correr la pagina, 
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







.controller('DoubleReplaceWordCtrl', function($scope, $http, $sce, $ionicLoading, $state, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService, serveLevel) {
	viewService.setView('DoubleReplaceWordCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var vocabularyLength = 0;
	var matrix = [];
	var times = 0;
	var maxScore = 40;
	var vals = [];
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='DoubleReplaceWordCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='DoubleReplaceWordCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
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
	};$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
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
			if(vals.length>0 && times<10){
				//$scope.showAlertPopUp('Muy Bien', null);
				$scope.timer=20;
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
			if(vals.length>0 && times<10){
				//$scope.showAlertPopUp('Fallaste, intenta en la siguiente', null);
				$scope.timer=20;
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
		var urlCompleta ="http://www.vocabulario.esy.es/persistirRelatedVocabularyService.php";
		var postUrl = $sce.trustAsResourceUrl(urlCompleta);
		$http.post(postUrl)
		.then(
			function (response) {
				$scope.vocabulary = response.data;
				$scope.emparejar();
				console.log(vals);
				vocabularyLength = $scope.vocabulary.length;
				console.log(vocabularyLength);
				if(serveLevel.isLevel('DoubleReplaceWordCtrl')){
					$scope.numdata = serveLevel.getLevelParam();
					if($scope.showGame()){
						$scope.hide($ionicLoading);  
						$scope.showAlertPopUp('Reemplaza la palabra x2', 'Intrucciones: Selecciona los sinónimos que encajen en los espacios del texto', true);
						$scope.timer=20;
					}else{
						$scope.hide($ionicLoading); 
						$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego show');
						$state.go('app.levels', {}, {reload: true});
					}
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
				/*switch(serveInclude.getPage()){
					case 5:
						console.log('case 1');
						$scope.numdata = 3;
						break;
					case 6:
						console.log('case 2');
						$scope.numdata = 3;
						break;
				}*/
				
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
			}
		);
	};
	$scope.contains = function(Array, element) {
		for (var i = 0; i < Array.length; i++) {
			console.log(Array[i]);
			console.log(Array[i]);
			console.log(Array[i] == element);
			if (Array[i] == element) {
				return true;
			}
		}
		return false;
	}
	$scope.doubleContains = function(Array, element1, element2) {
		for (var i = 0; i < Array.length; i++) {
			console.log(Array[i]);
			console.log(element1);
			console.log(Array[i][0] == element1);
			console.log(Array[i][1] == element2);
			if (Array[i][0] == element1 && Array[i][1] == element2) {
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
		console.log(vals);
		/*try{*/
			var alternative = '';
			$scope.name = '';
			$scope.id = '';
			var alternatives = [];
			matrix=[];
			//ingresa el la palabra a evaluar y las alternativas
			for (var i = 0; i < $scope.numdata; i++) {
				var random = Math.floor((Math.random()*vals.length)+1)-1;
				console.log(vals);
				console.log(vals[random]);
				if(i == 0){
					if($scope.contains(words, vals[random][0])){
						if(vals.length>0){
							i--;
						}else{
							break;
						}
					}else{
						console.log("random: "+random);
						vals.length--;
						words.push(vals[random][0]);
						console.log("2");
						console.log(vals[random][1]);

						var name =(vals[random][1].texto);
						name = name.replace(vals[random][1].nombre, vals[random][1].nombre.toLowerCase());
						name = name.replace(vals[random][1].nombre.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
						name = name.replace(vals[random][2].nombre, vals[random][2].nombre.toLowerCase());
						name = name.replace(vals[random][2].nombre.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
						/*var start = name.toLowerCase().indexOf(vals[random].nombre.toLowerCase());
						var end = name.toLowerCase().indexOf(" ", start);*/
						console.log("3");
						/*console.log("indexof: "+start+" to "+end);*/
						$scope.id =(vals[random][1].id);
						if(!$scope.doubleContains(alternatives, vals[random][1].id, vals[random][2].id)){
							var array = [];
							array.push(vals[random][1].id);
							array.push(vals[random][2].id);
							alternatives.push(array);
							console.log(alternatives);
							$scope.setMatrix(vals[random][0], vals[random][1].sinonimo+", "+vals[random][2].sinonimo);
						}
						console.log("4");
					}
				}else{
					console.log(alternatives[0]);
					console.log(vals[random][1].id);
					if(!$scope.doubleContains(alternatives, vals[random][1].id, vals[random][2].id)){
						alternatives.push(vals[random][1].id);
						$scope.setMatrix(vals[random][0], vals[random][1].sinonimo+", "+vals[random][2].sinonimo);
					}else{
						i--;
						console.log("/");
					}
				}
			};
			if(vals.length>=0){
				console.log("5");
				card.className ='card'; 
				var voc1 ='<p id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+name+'</p>';
				console.log("6");
				//desordena las alternativas              
				matrix = matrix.sort(function() {return Math.random() - 0.5});
				//ingresa las alternativas
				for (var i = 0; i < $scope.numdata; i++) {
					alternative = alternative + '<button class="button button-block button-fix button-balanced" ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button>';
				};
				console.log("7");
				//compilar botones ya que ng-click no setea al correr la pagina, 
				//por lo tanto las alteraciones en el DOM no son vistas por este
				var html = card.innerHTML = $compile(voc1 + alternative)($scope);
				page.empty();
				page.append(html);
				return true;
			}
		/*}catch(e){
			console.log(e);
			return false;
		}*/
	};
	$scope.emparejar = function(){
		console.log($scope.vocabulary);
		angular.forEach($scope.vocabulary, function(value, key) {
			angular.forEach($scope.vocabulary, function(valueS, keyS) {
				if(value.id==valueS.id && value.id_palabra!=valueS.id_palabra && value.id_palabra<valueS.id_palabra){
					var array = [];
					array.push(value.id);
					array.push(value);
					array.push(valueS);
					vals.push(array);
				}
			});
		});
	};
})








.controller('ReplaceWordCtrl', function($scope, $http, $sce, $ionicLoading, $state, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService) {
	viewService.setView('ReplaceWordCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var vocabularyLength = 0;
	var matrix = [];
	var times = 0;
	var maxScore = 40;
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='ReplaceWordCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='ReplaceWordCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
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
	};$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
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
				$scope.timer = 20;
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
				$scope.timer=20;
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
					$scope.showAlertPopUp('Reemplaza la palabra', 'Intrucciones: Selecciona el sinónimo que reemplaza la palabra resaltada en el texto', true);
					$scope.timer=20;
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
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
						console.log($scope.vocabulary[random].nombre);

						var name =($scope.vocabulary[random].texto_ejemplo);
						name = name.replace($scope.vocabulary[random].nombre, $scope.vocabulary[random].nombre.toLowerCase());
						name = name.replace($scope.vocabulary[random].nombre.toLowerCase(), function myFunction(x){return x.toUpperCase().bold();});
						/*var start = name.toLowerCase().indexOf($scope.vocabulary[random].nombre.toLowerCase());
						var end = name.toLowerCase().indexOf(" ", start);*/

						/*console.log("indexof: "+start+" to "+end);*/
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
				var voc1 ='<p id="'+$scope.id+'" name="titulo" style="width:100%; text-align: center;">'+name+'</p>';
				//desordena las alternativas              
				matrix = matrix.sort(function() {return Math.random() - 0.5});
				//ingresa las alternativas
				for (var i = 0; i < $scope.numdata; i++) {
					alternative = alternative + '<button class="button button-block button-fix button-balanced" ng-click="itemSelected('+matrix[i][0]+')" id="'+matrix[i][0]+'" name="alternative_'+i+'"  style="width:90%;">'+matrix[i][1]+'</button>';
				};
				//compilar botones ya que ng-click no setea al correr la pagina, 
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








.controller('SynonymousCtrl', function($scope, $http, $sce, $ionicLoading, $state, $compile, $ionicPopup, $timeout, serveInclude, serveData, serveLogin, viewService, serveLevel) {
	viewService.setView('SynonymousCtrl');
	var page = angular.element(document.getElementById('contenedor'));
	var card = document.createElement('div');
	var words = [];
	var vocabularyLength = 0;
	var matrix = [];
	var times = 0;
	var maxScore = 40;
	$scope.score = 0;
	$scope.trying = 0;
	$scope.startGame = false;
	var successfulGame = false;
	(function update() {
		//$timeout(update, 1000 * 5); 5 segundos
		//$timeout(update, 1000); 1 segundo
		
		if(!successfulGame){
			if($scope.timer<=0){
				if(viewService.getView()=='SynonymousCtrl'){
					$scope.gameOverForTime();
				}
			}else{
				if(viewService.getView()=='SynonymousCtrl'){
					$timeout(update, 1000);
					if($scope.startGame){
						$scope.timer -= 1;
					}
				}else{
					$scope.timer = 0;
				}
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
	};$scope.showAlertPopUp = function(title, template, e){
		if(template == null){
			var alertPopup = $ionicPopup.alert({
				title: title
			});
		}else if(e==null){
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}else{
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: template
			}).then(function(res) {
			  $scope.startGame = true;
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
				$scope.timer = 20;
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
				$scope.timer=20;
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
				if(serveLevel.isLevel('SynonymousCtrl')){
					$scope.numdata = serveLevel.getLevelParam();
				}
				console.log($scope.numdata);
				/*switch(serveInclude.getPage()){
					case 1:
						console.log('case 1');
						$scope.numdata = 3;
						break;
					case 2:
						console.log('case 2');
						$scope.numdata = 4;
						break;
				}*/
				if($scope.showGame()==true){
					$scope.hide($ionicLoading);
					$scope.showAlertPopUp('Sinónimos', 'Preparate!', true);
					$scope.timer=20;
				}else{
					$scope.hide($ionicLoading); 
					$scope.showAlertPopUp('Ha ocurrido un error', 'porfavor, vuelve a cargar el minijuego');
					$state.go('app.levels', {}, {reload: true});
				}
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
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
				//compilar botones ya que ng-click no setea al correr la pagina, 
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






.controller('challengeDetailCtrl', function($scope, $sce, $rootScope, $ionicPopup, $http, $timeout, $state, $ionicLoading, serveData, productService, serveLogin, serveLevel) {
	$scope.default = {image : 'default.png'};
	$scope.user = serveLogin.getUser();
	console.log("challengeDetail");
	$scope.levels = [
		{ title: 'Nivel 1', id: 1 , name: 'title1', ctl: 'MissingWordCtrl', alt: 3, img: 'Icon-level-01.png', link: 'missingWord', description: 'Rellena el espacio faltante'},
		{ title: 'Nivel 2', id: 2 , name: 'title2', ctl: 'MissingWordCtrl', alt: 4, img: 'Icon-level-02.png', link: 'missingWord', description: 'Rellena el espacio faltante'},
		{ title: 'Nivel 3', id: 3 , name: 'title3', ctl: 'ReplaceWordCtrl', alt: 3, img: 'Icon-level-03.png', link: 'replaceWord', description: 'Busca un sinónimo'},
		{ title: 'Nivel 4', id: 4 , name: 'title4', ctl: 'WordIdentifierCtrl', alt: 3, img: 'Icon-level-04.png', link: 'wordIdentifier', description: 'Sinonimos o Antonimos en una oración'},
		{ title: 'Nivel 5', id: 5 , name: 'title5', ctl: 'TermsCoupletsCtrl', alt: 3, img: 'Icon-level-05.png', link: 'termsCouplets', description: 'Sinonimos 3 alternativas'},
		{ title: 'Nivel 6', id: 6 , name: 'title6', ctl: 'DoubleReplaceWordCtrl', alt: 3, img: 'Icon-level-06.png', link: 'doubleReplaceWord', description: 'Sinonimos 3 alternativas'},
		{ title: 'Sinónimos', id: 7 , name: 'title6', ctl: 'SynonymousCtrl', alt: 3, img: 'Icon-level-06.png', link: 'doubleReplaceWord', description: 'Sinonimos 3 alternativas'}
	];
	
	console.log($scope.user);
	if(serveLogin.isLogin()){
		$scope.pageAccount = false;
		$scope.pageContent = true;
	}else{
		$scope.pageAccount = true;
		$scope.pageContent = false;
	}
	$scope.setLevelParameters = function(id){
		console.log(id);
		angular.forEach($scope.levels, function(value, key) {
			if(id == value.id){
				serveLevel.setLevelParam(value.ctl, value.alt, value.id);
			}
		});
	};
	$scope.callChallenges = function(){
		console.log("entró");
		if(serveLogin.isLogin()){
			$scope.course = {id_curso:$scope.user[4]};
			var entity = $scope.user;
			var objJSON = JSON.stringify($scope.course);
			$scope.show($ionicLoading);
			// Do the call to a service using $http or directly do the call here
			var urlCompleta ="http://www.vocabulario.esy.es/persistirChallengeService.php";
			var postUrl = $sce.trustAsResourceUrl(urlCompleta);
			console.log($scope.user);

			$http.post(postUrl, objJSON)
			.then(
				function (response) {
					$scope.exist = response.data;
					$scope.challenges = $scope.exist;
					console.log(JSON.stringify($scope.challenges));
					console.log(JSON.stringify($scope.challenges[0]));
					console.log(JSON.stringify($scope.challenges[1]));
					angular.forEach($scope.challenges, function(value, key) {
					  console.log("value: "+JSON.stringify(value));
					  console.log("key: "+key);
					  angular.forEach($scope.levels, function(valueLevel, keyLever) {
					  	console.log(value.nivel+", "+valueLevel.id);
						  if(value.nivel==valueLevel.id){
							value.nameLink = valueLevel.link;

						  }
					  });
					});
					console.log($scope.challenges);
					//$scope.level = $scope.challenge.level;
					$scope.hide($ionicLoading);
				},
				function (){
					$scope.hide($ionicLoading);  
					var alertPopup = $ionicPopup.alert({
						title: 'error al intentar obtener tus desafios'
					});
					$scope.closeLogin();
				}
			);
		}
	};
})





.controller('challengeCtrl', function($scope, $sce, $rootScope, $http, $timeout, $state, $ionicLoading, serveData, productService, serveLogin) {
	$scope.default = {image : 'default.png'};
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
		{ title: 'Nivel 6', id: 6 , name: 'title6', img: 'crucigramas.jpg', link: 'synonymous.html'}
	];
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
})







.controller('PleasureOfReadingCtrl', function($scope, $sce, $http, $ionicPopup, $ionicLoading, serveData, serveInclude, viewService) {
	viewService.setView('PleasureOfReadingCtrl');
	$scope.trying=0;
	$scope.loadBefore = function() {
		// Start showing the progress
		$scope.show($ionicLoading);
		// Do the call to a service using $http or directly do the call here
		var urlCompleta ="http://www.vocabulario.esy.es/persistirTextService.php";
		var postUrl = $sce.trustAsResourceUrl(urlCompleta);
		$http.post(postUrl)
		.then(
			function (response) {
				$scope.texts = response.data;
				console.log($scope.texts);
				$scope.hide($ionicLoading);  
			},
			function (){
				if($scope.trying==0){
					$scope.loadBefore();
					$scope.trying = $scope.trying+1;
				}else{
					$scope.hide($ionicLoading);  
					$scope.showAlertPopUp('Error', 'No se han podido importar los datos');
					$state.go('app.levels', {}, {reload: true});
				}
			}
		);
	};
	$scope.show = function() {
		$ionicLoading.show({
			template: '<p>Loading...</p><ion-spinner></ion-spinner>'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
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
});
