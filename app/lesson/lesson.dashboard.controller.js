//Creating LessonDashboardController to extend functions of LessonController

(function() {
    'use strict';

    angular
        .module('app')
        .controller('LessonDashboardController', LessonDashboardController);

    LessonDashboardController.$inject = ['$scope', 'LessonFactory', '$stateParams', 'localStorageService', 'StudentFactory', 'TeacherFactory'];

    /* @ngInject */
    function LessonDashboardController($scope, LessonFactory, $stateParams, localStorageService, StudentFactory, TeacherFactory) {
        var ctrl = this;
        ctrl.title = 'LessonDashboardController';
        ctrl.deleteLesson = deleteLesson;
        ctrl.editLesson = editLesson;
        ctrl.searchLessons = searchLessons;
        ctrl.addTeacher = addTeacher;

        ctrl.username = localStorageService.get("username");
        ctrl.teacherId = localStorageService.get("teacherId");
        ctrl.userRole = localStorageService.get("role");

        ctrl.today = new Date();

        ctrl.startDate = ctrl.today;
        ctrl.endDate = ctrl.today;
        ctrl.studentFilter = '';
        ctrl.durationFilter = '';

        activate();

        ////////////////

        function activate() {
            searchLessons(ctrl.startDate, ctrl.endDate);
        }

        //Creating function to call LessonFactory's deleteLesson method to archive lessons and hide from users
        function deleteLesson(data, username) {
            var index = ctrl.lessons.indexOf(data);
            LessonFactory.deleteLesson(data, username).then(function(response) {

                    ctrl.lessonDel = response.data;
                    toastr.success('Lesson Successfully Deleted!');
                    ctrl.lessons.splice(index, 1);

                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.info(error);
                    }
                });
        }

        //Creating function to call LessonFactory's editLesson method to update lessons
        function editLesson(data, newTeacher, newStudent, newDateTime, newDuration) {

            var updatedLesson = { _id: data._id, teacher: newTeacher._id, student: newStudent._id, createdBy: ctrl.username};

            if (newDateTime){
                updatedLesson.signedInDate =  moment(newDateTime, 'MM-DD-YYYY HH:mm').toDate();
            } else{
                updatedLesson.signedInDate = data.signedInDate;
            }

            if (newDuration){
                updatedLesson.duration = newDuration.value;
            } else {
                updatedLesson.duration = data.duration;
            }
 
            //creating version history by cloning previous version history and stripping out self references to avoid JSON parsing loop
            updatedLesson.previousVersion = data.previousVersion;
            data.previousVersion = [];
            updatedLesson.previousVersion.push(data);

            LessonFactory.editLesson(updatedLesson)
                .then(function(response) { 

                        ctrl.newStudent = '';
                        ctrl.newSignInDate ='';
                        ctrl.newDuration = '';

                        toastr.success('Lesson Updated!');
                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Creating function to call LessonFactory's searchLessons method to advanced search
        function searchLessons(startDate, endDate, studentFilter, durationFilter) {

            startDate = new Date(startDate).setHours(0, 0, 0, 0);
            endDate = new Date(endDate).setHours(23, 59, 59, 999);

            ctrl.searchQuery = { startDate: startDate, endDate: endDate, student: studentFilter, duration: durationFilter };

            if (ctrl.userRole === 'teacher') {
                ctrl.searchQuery.teacherId = ctrl.teacherId;
            }

            LessonFactory.searchLessons(ctrl.searchQuery)
                .then(function(response) {

                        ctrl.lessons = (response.data.lessons);
                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Creating function to call TeacherFactory's addTeacher method to add teacher
        function addTeacher(name, email, phoneNumber, streetAddress, city, state, zip, gender, independent) {

            var newTeacher = { name: name, email, email, phoneNumber: phoneNumber, streetAddress: streetAddress, city: city, state: state, zip: zip, gender: gender, independent: independent }

            TeacherFactory.addTeacher(newTeacher)
                .then(function(response) {

                        $scope.vm.teachers.push(response.data.teacher);
                        toastr.success('New Teacher Registered!');
                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }
    }


})();
