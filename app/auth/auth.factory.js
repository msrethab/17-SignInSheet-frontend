//Creating AuthFactory to handle user authentication related services

(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$http', '$q', 'localStorageService', 'apiUrl', 'jwtHelper', '$state'];

    /* @ngInject */
    function AuthFactory($http, $q, localStorageService, apiUrl, jwtHelper, $state) {
        var service = {
            registerUser: registerUser,
            loginUser: loginUser,
            updateUser: updateUser,
            logoutUser: logoutUser,
            tokenExpired: tokenExpired,
            authorizeRoute: authorizeRoute
        };
        return service;

        ////////////////

        //Checks user confirm password and then uses POST HTTP call to register user in database
        function registerUser(newUser) {

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: apiUrl + 'register',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: newUser
            }).then(function(response) {
                    if (response.status === 200) {
                        defer.resolve(response);
                    } else {
                        defer.reject("No data found!");
                    }
                },
                function(error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        //Uses PUT HTTP call to update a User in the database
        function updateUser(updateUserRequest) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: apiUrl + 'register/' + updateUserRequest.updatedUser._id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: updateUserRequest
            }).then(function(response) {
                    if (response.status = 204) {
                        defer.resolve(response);
                    } else {
                        defer.reject("No data found!");
                    }
                },
                function(error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        //Uses POST HTTP call to send login information to server and return authentication token
        function loginUser(loginEmail, loginPassword) {
            var defer = $q.defer();

            var login = { email: loginEmail, password: loginPassword };

            $http({
                method: 'POST',
                url: apiUrl + 'authenticate',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: login
            }).then(function(response) {
                    if (response.status === 200) {

                        //Stores access token and username on successful login

                        var token = response.data.token;
                        var tokenPayload = jwtHelper.decodeToken(token);

                        localStorageService.set('access_token', token);
                        localStorageService.set('username', tokenPayload._doc.email);
                        localStorageService.set('role', tokenPayload._doc.role);
                        localStorageService.set('teacherId', tokenPayload._doc.teacherId);
                        localStorageService.set('name', tokenPayload._doc.name);
                        localStorageService.set('_id', tokenPayload._doc._id);

                        defer.resolve(response);
                    } else {
                        defer.reject("No data found!");
                    }
                },
                function(error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        function tokenExpired() {
            var token = localStorageService.get('access_token');

            if (token) {
                var tokenExpired = jwtHelper.isTokenExpired(token);
                return tokenExpired;
            }
        }

        function authorizeRoute(accessRole) {
            var userRole = localStorageService.get('role');

            if (userRole) {
                if (userRole === accessRole || userRole === 'admin') {
                    return true;
                }
                if (accessRole === 'user' && userRole === 'teacher') {
                    return true;
                }
                if (userRole === 'user') {
                    $state.go('signIns');
                    return false;
                }
                if(userRole ==='teacher'){
                    $state.go('dashboard');
                    return false;
                } else {
                    $state.go('accessDenied');
                    return false;
                }
            } else {
                $state.go('home');
                return false;
            }
        }

        //Defining method for logging users out by clearing out access token from local storage
        function logoutUser() {
            localStorageService.clearAll();

        }
    }
})();
