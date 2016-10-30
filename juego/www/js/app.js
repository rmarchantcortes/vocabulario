// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'challengeDetailCtrl'
      }
    }
  })
  
  .state('app.termsCouplets', {
      url: '/termsCouplets',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/termsCouplets.html',
          controller: 'TermsCoupletsCtrl'
        }
      }
    })
  .state('app.replaceWord', {
      url: '/replaceWord',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/replaceWord.html',
          controller: 'ReplaceWordCtrl'
        }
      }
    })
  .state('app.doubleReplaceWord', {
      url: '/doubleReplaceWord',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/doubleReplaceWord.html',
          controller: 'DoubleReplaceWordCtrl'
        }
      }
    })
  .state('app.missingWord', {
      url: '/missingWord',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/missingWord.html',
          controller: 'MissingWordCtrl'
        }
      }
    })
  .state('app.browse', {
      url: '/browse',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'challengeCtrl'
        }
      }
    })
    .state('app.levels', {
      url: '/levels',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/levels.html',
          controller: 'LevelsCtrl'
        }
      }
    })
    .state('app.synonymous', {
    url: '/synonymous',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/synonymous.html',
        controller: 'SynonymousCtrl'
      }
    }
  })
    .state('app.synonymousAntonym', {
    url: '/synonymousAntonym',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/synonymousAntonym.html',
        controller: 'synonymousAntonymCtrl'
      }
    }
  })
    .state('app.wordIdentifier', {
    url: '/wordIdentifier',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/wordIdentifier.html',
        controller: 'WordIdentifierCtrl'
      }
    }
  })
    .state('app.comments', {
    url: '/comments',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/comments.html',
        controller: 'commentsCtrl'
      }
    }
  })
    .state('app.pleasureOfReading', {
      url: '/pleasureOfReading',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/pleasureOfReading.html',
          controller: 'PleasureOfReadingCtrl'
        }
      }
    })
  .state('app.single', {
    url: '/playlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/levels');
});
