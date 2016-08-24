//Creating module for to handle ui-routing, localStorage, and Interceptor

(function() {
    'use strict';

    var app = angular.module('app', ['ui.router', 'LocalStorageModule', 'angular-jwt', 'ui.select', 'ngSanitize', 'moment-picker', 'phonenumberModule']);

    app.config(function(localStorageServiceProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');

        localStorageServiceProvider
            .setPrefix('app')
            .setStorageType('localStorage')
            .setNotify(true, true)

        $urlRouterProvider.otherwise('/dashboard');

        $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
            url: '/home',
            templateUrl: '../partials/partial-home.html'
        })

        // MULTIPLE ADDITIONAL STATES AND NESTED VIEWS =========================
        .state('signIns', {
                url: '/signIns',
                templateUrl: '../partials/partial-signIns.html',
                controller: 'LessonController',
                controllerAs: 'vm',
                data: {
                    role: 'user'
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '../partials/partial-dashboard.html',
                controller: 'LessonController',
                controllerAs: 'vm',
                data: {
                    role: 'teacher'
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '../partials/partial-profile.html',
                controller: 'LessonController',
                controllerAs: 'vm',
                data: {
                    role: 'teacher'
                }
            })
            .state('teachers', {
                url: '/teachers',
                templateUrl: '../partials/partial-teachers.html',
                controller: 'LessonController',
                controllerAs: 'vm',
                data: {
                    role: 'admin'
                }
            })
            .state('accessDenied', {
                url: '/accessDenied',
                templateUrl: '../partials/partial-accessDenied.html'
            })

    });

    //route redirection by roles
    app.run(['$rootScope', '$state', '$stateParams', 'AuthFactory',
        function($rootScope, $state, $stateParams,
            AuthFactory) {
            $rootScope.$on('$stateChangeStart',
                function(event, toState) {

                    if (angular.isDefined(toState.data)) {
                        if (!AuthFactory.authorizeRoute(toState.data.role)) {
                            event.preventDefault();
                        }
                    }
                });
        }
    ]);

    //Global variable 
    app.value("apiUrl", "https://synergy-sign-in.herokuapp.com");
})();
