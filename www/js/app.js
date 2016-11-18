// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null; //global variable dbsqlite
var isLoggedIn = 0;

angular.module('usoilmobile', ['ionic', 'usoilmobile.controllers', 'usoilmobile.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
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

    db = $cordovaSQLite.openDB({ name: "my.db" });
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (user_id integer primary key, app_user_id integer, wp_user_id integer, email text, password text, status integer, date_created text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS fryer_t_m_p_ss (fryer_t_m_p_ss_id integer primary key, fryer_id integer, measured_tpm integer, oil_temp integer, changed_oil integer, quantity_added integer, oil_moved integer, amount_moved integer, moved_to_fryer_id integer, creation_date text, status integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS fryers (fryer_id integer primary key, location_id integer, fryer_name text, make text, model text, serial_number text, oil_capacity integer, benchmark integer, status integer created_at text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (user_id integer primary key, app_user_id integer, wp_user_id integer, email text, password text, status integer, date_created text)");
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

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      }
    }
  })

  .state('app.tmps', {
    url: '/tmps',
    views: {
      'menuContent': {
        templateUrl: 'templates/tmps.html',
        controller: 'TmpsController'
      }
    }
  })

  .state('app.fryer', {
      url: '/fryer',
      views: {
        'menuContent': {
          templateUrl: 'templates/fryer.html'
        }
      }
  });
  /*
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });
  */
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tmps');
});
