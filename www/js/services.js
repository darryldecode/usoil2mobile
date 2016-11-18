angular.module('usoilmobile.services', [])

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
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

.service('TmpsService', function($q, $http) {
    return {
        tmpsLocation: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://localhost:8000/api/v1/fryer-tmps/locations").then(function (response) {
                deferred.resolve(response.data.data);  
            }, function (response) {
                deferred.reject(response.data || 'Request failed');
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
});