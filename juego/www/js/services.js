
angular.module('starter.services', [])

.service('serveLogin', function() {
  var User=0;
  var idPerson = -1;
  var namePerson = '';
  var lastNamePerson = '';
  var array = [];
  var setUser = function(id, name, lastName) {
    User = 1;
    idPerson=id;
    namePerson=name;
    lastNamePerson=lastName;
  };
  var isLogin = function(){
    if(User == 1){
      return true;
    }else{
      return false;
    }
  };
  var getUser = function(){
    array=[];
    array.push(idPerson);
    array.push(namePerson);
    array.push(lastNamePerson);
    return array;
  };
  return {
    isLogin: isLogin,
    setUser: setUser,
    getUser: getUser
  };

})
.service('productService', function() {
  var productList = [];
  var ClassList = [];
  var addOrganization = function(idObj, nameObj) {
      productList = [];
      productList.push(idObj);
      productList.push(nameObj);
  };

  var getOrganization = function(){
      return productList;
  };
  var addClass = function(idObj, nameObj) {
      ClassList = [];
      ClassList.push(idObj);
      ClassList.push(nameObj);
  };

  var getClass = function(){
      return ClassList;
  };
  return {
    addOrganization: addOrganization,
    getOrganization: getOrganization,
    addClass: addClass,
    getClass: getClass
  };

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
    console.log("getNextPage: "+(page+1));
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