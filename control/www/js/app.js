// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'chart.js', 'starter.controllers', 'starter.services', 'nvd3'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
/*  .state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})*/
	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html',
		controller: 'DashCtrl'
	})

	// Each tab has its own nav history stack:

	.state('tab.descargas', {
		url: '/descargas',
		cache: false,
		views: {
			'tab-dash': {
				templateUrl: 'templates/tab-descargas.html',
				controller: 'DescargasCtrl'
			}
		}
	})
	.state('tab.challenge', {
		url: '/organizations/:organizationId/:classId/challengesList/challenge',
		cache: false,
		views: {
			'tab-chats': {
				templateUrl: 'templates/tab-challenge.html',
				controller: 'ChallengeCtrl'
			}
		}
	})
	.state('tab.challengesList', {
		url: '/organizations/:organizationId/:classId/challengesList',
		cache: false,
		views: {
			'tab-chats': {
				templateUrl: 'templates/tab-challengesList.html',
				controller: 'ChallengesListCtrl'
			}
		}
	})
	.state('tab.organizations', {
		url: '/organizations',
		cache: false,
		views: {
			'tab-chats': {
				templateUrl: 'templates/tab-organizations.html',
				controller: 'OrganizationsCtrl'
			}
		}
	})
	.state('tab.class', {
		url: '/organizations/:organizationId',
		views: {
			'tab-chats': {
				templateUrl: 'templates/class.html',
				controller: 'ClassCtrl'
			}
		}
	})
	.state('tab.students', {
		url: '/organizations/:organizationId/:classId',
		views: {
			'tab-chats': {
				templateUrl: 'templates/students.html',
				controller: 'StudentCtrl'
			}
		}
	})
	.state('tab.studentDetail', {
		url: '/organizations/:organizationId/:classId/:studentId',
		views: {
			'tab-chats': {
				templateUrl: 'templates/studentDetail.html',
				controller: 'StudentDetailCtrl'
			}
		}
	})
	.state('tab.account', {
		url: '/account',
		cache: false,
		views: {
			'tab-account': {
				templateUrl: 'templates/tab-account.html',
				controller: 'AccountCtrl'
			}
		}
	})
	.state('tab.home', {
		url: '/home',
		cache: false,
		views: {
			'tab-home': {
				templateUrl: 'templates/tab-home.html',
				controller: 'HomeCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/home');

});
