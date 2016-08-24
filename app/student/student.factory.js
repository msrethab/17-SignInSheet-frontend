
//Creating StudentFactory to handle user Student related services

(function() {
    'use strict';

    angular
        .module('app')
        .factory('StudentFactory', StudentFactory);

    StudentFactory.$inject = ['$http', '$q', 'localStorageService', 'apiUrl'];

    /* @ngInject */
    function StudentFactory($http, $q, localStorageService, apiUrl) {
        var url = apiUrl + 'students/'

        var service = {
            getStudents: getStudents,
            addStudent: addStudent,
            deleteStudent: deleteStudent,
            editStudent: editStudent,
        };
        return service;

        ////////////////

        //Uses GET HTTP call to retrieve all Student objects from database
        function getStudents() {
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

        //Uses POST HTTP call to add a new Student into the database
        function addStudent(newStudent) {

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: newStudent
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

        //Uses DELETE HTTP call to delete Student from database
        function deleteStudent(studentId) {

            var defer = $q.defer();

            $http({
                method: 'DELETE',
                url: url + studentId,
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

        //Uses PUT HTTP call to update a Student in the database
        function editStudent(updatedStudent) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: url + updatedStudent._id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: updatedStudent
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
