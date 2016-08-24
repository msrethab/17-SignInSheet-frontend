//Creating LessonFactory to handle user Lesson related services

(function() {
    'use strict';

    angular
        .module('app')
        .factory('LessonFactory', LessonFactory);

    LessonFactory.$inject = ['$http', '$q', 'localStorageService', 'apiUrl'];

    /* @ngInject */
    function LessonFactory($http, $q, localStorageService, apiUrl) {
        var url = apiUrl + 'lessons/'

        var service = {
            getLessons: getLessons,
            addLesson: addLesson,
            deleteLesson: deleteLesson,
            editLesson: editLesson,
            searchLessons: searchLessons,
            countLessonsByTeacher: countLessonsByTeacher
        };
        return service;

        ////////////////

        //Uses GET HTTP call to retrieve all Lesson objects from database
        function getLessons() {
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

        //Uses POST HTTP call to add a new Lesson into the database
        function addLesson(newLesson) {

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: newLesson
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

        //Uses DELETE HTTP call to delete Lesson from database
        function deleteLesson(lesson, username) {

            var defer = $q.defer();

            lesson.archived = true;
            lesson.archivedDate = moment().toDate();
            lesson.archivedBy = username;

            $http({
                method: 'PUT',
                url: url + lesson._id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: lesson
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

        //Uses PUT HTTP call to update a Lesson in the database
        function editLesson(newLesson) {

            var defer = $q.defer();

            newLesson.createdDate = moment().toDate();

            $http({
                method: 'PUT',
                url: url + newLesson._id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: newLesson
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

        //Uses POST HTTP call to send searchQuery object to database and returns results of advanced search
        function searchLessons(searchQuery) {
            var defer = $q.defer();

            $http({
                method: 'POST',
                url: url + 'search',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: searchQuery
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

        //Uses GET HTTP call to send searchQuery object to database and returns results of advanced search
        function countLessonsByTeacher(monthFilter) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: url + 'search/count?month=' + monthFilter,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
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
    }
})();
