angular.module('usoilmobile.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // $scope.$on('$ionicView.afterLeave', function(e){
  //   $ionicHistory.clearCache();
  //   console.log(e);
  // });

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
//     $scope.playlists = [
//       { title: 'Reggae', id: 1 },
//       { title: 'Chill', id: 2 },
//       { title: 'Dubstep', id: 3 },
//       { title: 'Indie', id: 4 },
//       { title: 'Rap', id: 5 },
//       { title: 'Cowbell', id: 6 }
//     ];
// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {
//   console.log($stateParams.playlistId);
// })


/*
|
| REFERENCE:
| > http://ngcordova.com/docs/plugins/barcodeScanner/
| > https://www.thepolyglotdeveloper.com/2014/09/implement-barcode-scanner-using-ionic-framework/
*/


// Issue: Phonegap desktop http get throw error. ionic serve http get success.
.controller('TmpsController', function($scope, $cordovaBarcodeScanner, $ionicPopup, $state, TmpsService, $ionicModal, $sce) {
  if(isLoggedIn) {
    var token = isLoggedIn;
    TmpsService.tmpsLocation(token).success(function(data) {
      $scope.clientTpmsData = data;
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
          title: 'TmpsService Error',
          template: data
      });
    });
  }

  $scope.manualEntry = function(){
    // console.log($scope.clientTpmsData.casino.id + "|" + $scope.clientTpmsData.restaurant.id);
  }

  $scope.linkStr = null; //$sce.trustAsResourceUrl('http://localhost:8000/show-fryer/9');
  $ionicModal.fromTemplateUrl('show-fryer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {        
    $scope.modal.hide();
  };

  document.addEventListener('deviceready', function() {
    
    $scope.scanQRcode = function () {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        // var alertPopup = $ionicPopup.alert({
        //   title: barcodeData.text,
        //   template: 'Format:'+barcodeData.format+' || isCancelled:' + barcodeData.cancelled
        // });
        $scope.linkStr = $sce.trustAsResourceUrl(barcodeData.text);
        $scope.modal.show();
      }, function(error) {
        var alertPopup = $ionicPopup.alert({
          title: error
        });
      });
    };

  }, $scope.scanQRcode = function () {
    $scope.linkStr = $sce.trustAsResourceUrl('http://localhost:8000/show-fryer/3');
    $scope.modal.show();
  });

  if(!isLoggedIn)
    $state.go('app.login');

})


.controller('FryerEntryController', function($scope, $stateParams){
  
})


.controller('LoginController', function($scope, LoginService, $ionicPopup, $state, $ionicLoading){
  $scope.data = {};

  $scope.login = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

    var formData = {
       username: $scope.data.username,
       password: $scope.data.password
    };
    //alert($scope.data.username + " | " +$scope.data.password);
    LoginService.loginUser(formData).success(function(data) {
      $ionicLoading.hide().then(function(){
        isLoggedIn = data;
        $state.go('app.tmps');
      });
    }).error(function(data) {
      $ionicLoading.hide().then(function(){
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
      });
    });
  }
})

