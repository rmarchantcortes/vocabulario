
angular.module('starter.services', [])
.factory('serveData', function() {

})
.service('serveInclude', function() {
  var page=0;
  var setPage = function(lvl) {
    console.log("setPage: "+lvl);
    page = lvl;
  };
  var getPage = function(){
    console.log("getPage: "+page);
    return page;
  };
  var getNextPage = function(){
    console.log("getNextPage: "+page+1);
    return (page+1);
  };
  return {
    getNextPage: getNextPage,
    setPage: setPage,
    getPage: getPage
  };

})
.service('serveData', function() {
	  var unlockLevels = 1;
	  var aux = false;
  var setLastLevel = function(idObj) {
    if (idObj > unlockLevels){
      unlockLevels = idObj;
    }
  };
  var lastLevel =function(){
  	return unlockLevels;
  };
  return {
    setLastLevel: setLastLevel,
    lastLevel: lastLevel
  };

});