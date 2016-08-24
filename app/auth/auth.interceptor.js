//Creating Authorization Interceptor for managing HTTP requests and responses

(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['localStorageService'];

    /* @ngInject */
    function AuthInterceptor(localStorageService) {
        var service = {
            request: request
        };
        return service;

        ////////////////

        //Interceptor appends [x-access-token] header with access token from local storage on all requests except login

        function request(config) {

            config.headers = config.headers || {};
            var access_token = localStorageService.get('access_token');

            if (access_token) {
                config.headers['x-access-token'] = access_token;
            }

            return config;
        }
    }
})();
