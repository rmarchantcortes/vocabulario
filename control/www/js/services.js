angular.module('starter.services', [])

.factory('Organizations', function() {
  // Might use a resource here that returns a JSON array
  /*return $resource("js/data.json", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })*/
  // Some fake testing data
  //var organizations = 
  /*[{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];*/

  return {
    /*all: function() {
      return organizations;
    },
    remove: function(chat) {
      organizations.splice(organizations.indexOf(organization), 1);
    },*/
    get: function(organizationId, global) {
      for (var i = 0; i < global.length; i++) {
        if (global[i].id === parseInt(organizationId)) {
          return global[i];
        }
      }
      return null;
    }
  };
})

.factory('Clases', function() {
  return {
    /*all: function() {
      return organizations;
    },
    remove: function(chat) {
      organizations.splice(organizations.indexOf(organization), 1);
    },*/
    get: function(classId, global) {
      for (var i = 0; i < global.length; i++) {
        if (global[i].id === parseInt(classId)) {
          return global[i];
        }
      }
      return null;
    }
  };
})
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
    console.log(User);
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

});
