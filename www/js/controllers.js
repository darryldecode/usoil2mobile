angular.module('usoilmobile.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  /*
    Form data for the login modal
    $scope.loginData = {};

    Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  */
  $scope.logout = function() {
    isLoggedIn = 0;
    $state.go('app.login');
  };
})

// .controller('PlaylistsCtrl', function($scope) {
  //   $scope.playlists = [
  //     { title: 'Reggae', id: 1 },
  //     { title: 'Chill', id: 2 },
  //     { title: 'Dubstep', id: 3 },
  //     { title: 'Indie', id: 4 },
  //     { title: 'Rap', id: 5 },
  //     { title: 'Cowbell', id: 6 }
  //   ];
// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });


/*
|
| REFERENCE:
| > http://ngcordova.com/docs/plugins/barcodeScanner/
| > https://www.thepolyglotdeveloper.com/2014/09/implement-barcode-scanner-using-ionic-framework/
*/


// Issue: Phonegap desktop http get throw error. ionic serve http get success.
.controller('TmpsController', function($scope, $cordovaBarcodeScanner, $ionicPopup, $state, TmpsService) {

  TmpsService.tmpsLocation().success(function(data) {
    $scope.casinos = data;
    $scope.restaurants = data;
    var alertPopup = $ionicPopup.alert({
        title: 'TmpsService Data',
        template: data
    });
  }).error(function(data) {
    var alertPopup = $ionicPopup.alert({
        title: 'TmpsService Error',
        template: data
    });
  });

  $scope.scanQRcode = function () {
    $cordovaBarcodeScanner.scan().then(function(barcodeData) {
      var alertPopup = $ionicPopup.alert({
        title: barcodeData.text,
        template: 'Format:'+barcodeData.format+' || isCancelled:' + barcodeData.cancelled
      });
    }, function(error) {
      var alertPopup = $ionicPopup.alert({
        title: error
      });
    });
  };

  if(!isLoggedIn)
    $state.go('app.login');

})

.controller('LoginController', function($scope, LoginService, $ionicPopup, $state){
  $scope.data = {}; //[{'user':'leonard'}, {'pass': 'pass'}];
  $scope.login = function() {
    //alert($scope.data.username + " | " +$scope.data.password);
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        isLoggedIn = 1;
        $state.go('app.tmps');
    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
    });
  }
})

