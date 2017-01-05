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
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.login');
  };
})

/*
  .controller('PlaylistsCtrl', function($scope) {
      $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
      ];
  })

  .controller('PlaylistCtrl', function($scope, $stateParams) {
    console.log($stateParams.playlistId);
  })
*/


/*
|
| REFERENCE:
| > http://ngcordova.com/docs/plugins/barcodeScanner/
| > https://www.thepolyglotdeveloper.com/2014/09/implement-barcode-scanner-using-ionic-framework/
*/
.controller('TmpsController', function($scope, $cordovaBarcodeScanner, $ionicPopup, $state, TmpsService, $ionicModal, $sce, $ionicHistory) {
  if(isLoggedIn) {
    var token = isLoggedIn;
    TmpsService.tmpsLocation(token).success(function(data) {
      $scope.clientTpmsData = data;
      
      // document.addEventListener('deviceready', function() {
      //   // sync data from live to SQLite
      // }, function(err) {
      //  console.log(err);
      // });
    for (var i = 0; i < data.casino_links.length; i++) {
      tmpCasino.push(data.casino_links[i].casino);
    }
    for (var x = 0; x < data.restaurant_links.length; x++) {
      tmpRestaurant.push(data.restaurant_links[x].restaurant);
    }

    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
          title: 'TmpsService Error',
          template: data
      });
    });
  } else {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.login');
  }


  $scope.manualEntry = function() {
    $state.go('app.fryer-entry', {'casinoId':$scope.clientTpmsData.casino.id, 'restaurantId':$scope.clientTpmsData.restaurant.id});
  }

  /* MODAL iFRAME for QRcode result */
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
        $scope.linkStr = $sce.trustAsResourceUrl(barcodeData.text);
        $scope.modal.show();
      }, function(error) {
        var alertPopup = $ionicPopup.alert({
          title: error
        });
      });
    };

  }, $scope.scanQRcode = function () {
    $scope.linkStr = $sce.trustAsResourceUrl('http://usoil2app.vizsion.com/show-fryer/3');
    $scope.modal.show();
  });

})

/*FRYER ENTRY CONTROLLER
  |
  | $scope, $stateParams
  |
*/
.controller('FryerEntryController', function($scope, $stateParams, $ionicPopup, $ionicLoading, FryerEntryService){
  $scope.datenow = new Date();
  $scope.casino = 'Casino - ' + tmpCasino.filter(function(casino){ return casino.id === parseInt($stateParams.casinoId) })[0].casino_trade_name;
  $scope.restaurant = 'Restaurant - ' + tmpRestaurant.filter(function(restaurant){ return restaurant.id === parseInt($stateParams.restaurantId) })[0].restaurant_name;
  $scope.fryers = {};

  //LOADING SCREEN
  $ionicLoading.show({
    template: 'Loading...'
  });
  FryerEntryService.fryerEntry(isLoggedIn, $stateParams.restaurantId).success(function (data) {
    $ionicLoading.hide().then(function(){
      $scope.fryers = data;
      $scope.fryers.countStr = ((data.fryer_links.length >= 1) ? data.fryer_links.length + ' Friers Total': 'No fryer found for this');
      console.log(data);
    });
  }).error(function (data) {
    $ionicLoading.hide().then(function(){
      var alertPopup = $ionicPopup.alert({
          title: 'Fryer entry failed!',
          template: data
      });
    });
  });

})

/* LOGIN CONTROLLER
 |
 |
*/
.controller('LoginController', function($scope, LoginService, $ionicPopup, $state, $ionicLoading, $ionicHistory){
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
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
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

.controller('RequestServiceController', function($scope, RequestServService, $ionicPopup, $state, $ionicLoading, $ionicHistory) {
  $scope.data = {};
  
  if(isLoggedIn) {
  var token = isLoggedIn;
  
  $scope.request_service_submit = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  
    var formData = {
       name: $scope.data.name,
       email: $scope.data.email,
       mobile: $scope.data.mobile,
       service: $scope.data.service,
    };
    RequestServService.saveRequestService(formData).success(function(data) {
      $ionicLoading.hide().then(function(){
      isLoggedIn = data;
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      var alertPopup = $ionicPopup.alert({
        title: 'Thank you!',
        template: 'Request Service has been submitted successfully!'
      });
      $scope.data = {};
      //$state.go('app.request-service');
      });
    })/*.error(function(data) {
        $ionicLoading.hide().then(function(){
        var alertPopup = $ionicPopup.alert({
          title: 'Sorry!',
          template: data
        });
        });
    })*/;  
    }
    //Pass Service Type Dropdown Values
  } else {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.login');
  }

  /*$scope.saveRequestService = function() {
    $state.go('app.request-service', {'name':$scope.data.name.id, 'email':$scope.data.email.id, 'mobile':$scope.data.mobile.id, 'service':$scope.data.service.id});
  }*/
})