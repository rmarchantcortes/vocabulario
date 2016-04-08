
angular.module('starter.services', [])
.factory('serveData', function() {

})
.service('serveData', function() {
	  var nose = false;
	  var aux = false;
  var desblok = function(idObj) {
  	console.log("service");
    nose = idObj;
    aux = true;
  };
  var getdesblok = function(){
    return nose;
  };
  var pasoPorService =function(){
  	return aux;
  };
  return {
    desblok: desblok,
    getdesblok: getdesblok,
    pasoPorService: pasoPorService
  };

});