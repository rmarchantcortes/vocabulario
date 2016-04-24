
angular.module('starter.services', [])
.factory('serveData', function() {

})
.service('serveInclude', function() {
  var page=0;
  var setPage = function(lvl) {
    console.log("setPage");
    page = lvl;
  };
  var getPage = function(){
    return page;
  };
  return {
    setPage: setPage,
    getPage: getPage
  };

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