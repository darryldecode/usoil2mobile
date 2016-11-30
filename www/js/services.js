angular.module('usoilmobile.services', [])

.service('LoginService', function($q, $http, urls) {
    
    return {
        loginUser: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(urls.BASE_API + "/client-login", data).then(function (response) {
                console.log(response);
                if(response.data != 0 || response.data != '0')
                    deferred.resolve(response.data);  
                else
                    deferred.reject(response.data || 'Wrong credentials');
            }, function (response) {
                deferred.reject(response.data || 'Wrong credentials');
            });
 
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('TmpsService', function($q, $http, urls) {
    return {
        tmpsLocation: function (token) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(urls.BASE_API + "/client-login/fryer-tpms-locations?token="+token).then(function (response) {
                console.log(response);
                deferred.resolve(response.data.data);  
            }, function (response) {
                deferred.reject(response.data || 'Request failed!');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('FryerEntryService', function($q, $http, urls) {
    return {
        fryerEntry: function (token, restaurantId) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(urls.BASE_API + "/client-login/fryer-entry?restaurantId="+ restaurantId +"&token=" + token).then(function (response) {
                deferred.resolve(response.data.data);
            }, function (response) {
                deferred.reject(response.data || 'Request failed!');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;

        }
    }
})

// .service('Auth', function($q, $http){
    //     function urlBase64Decode(str) {
    //         var output = str.replace('-', '+').replace('_', '/');
    //         switch (output.length % 4) {
    //             case 0:
    //                 break;
    //             case 2:
    //                 output += '==';
    //                 break;
    //             case 3:
    //                 output += '=';
    //                 break;
    //             default:
    //                 throw 'Illegal base64url string!';
    //         }
    //         return window.atob(output);
    //     }

    //     function getClaimsFromToken() {
    //         var token = $localStorage.token;
    //         var user = {};
    //         if (typeof token !== 'undefined') {
    //            var encoded = token.split('.')[1];
    //            user = JSON.parse(urlBase64Decode(encoded));
    //         }
    //         return user;
    //     }

    //     var tokenClaims = getClaimsFromToken();

    //     return {
    //         // signup: function (data, success, error) {
    //         //     $http.post(urls.BASE + '/signup', data).success(success).error(error)
    //         // },
    //         // signin: function (data, success, error) {
    //         //     $http.post(urls.BASE + '/signin', data).success(success).error(error)
    //         // },
    //         // logout: function (success) {
    //         //     tokenClaims = {};
    //         //     delete $localStorage.token;
    //         //     success();
    //         // },
    //         getTokenClaims: function () {
    //             return tokenClaims;
    //         }
    //     }
// })