//Creating TeacherFactory to handle user Teacher related services

(function() {
    'use strict';

    angular
        .module('app')
        .factory('TeacherFactory', TeacherFactory);

    TeacherFactory.$inject = ['$http', '$q', 'localStorageService', 'apiUrl'];

    /* @ngInject */
    function TeacherFactory($http, $q, localStorageService, apiUrl) {
        var url = apiUrl + 'teachers/'

        var service = {
            getTeachers: getTeachers,
            addTeacher: addTeacher,
            deleteTeacher: deleteTeacher,
            updateTeacher: updateTeacher,
            getTeacherById: getTeacherById
        };
        return service;

        ////////////////

        function getTeachers() {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: url
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        function getTeacherById(teacherId) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: url + teacherId
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        //Uses POST HTTP call to add a new Teacher into the database
        function addTeacher(newTeacher) {

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: newTeacher
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        //Uses DELETE HTTP call to delete Teacher from database
        function deleteTeacher(teacherId) {

            var defer = $q.defer();

            $http({
                method: 'DELETE',
                url: url + teacherId,
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        //Uses PUT HTTP call to update a Teacher in the database
        function updateTeacher(updatedTeacher) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: url + updatedTeacher._id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: updatedTeacher
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
    }
})();
