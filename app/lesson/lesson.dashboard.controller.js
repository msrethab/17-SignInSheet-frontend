//Creating LessonDashboardController to extend functions of LessonController

(function() {
    'use strict';

    angular
        .module('app')
        .controller('LessonDashboardController', LessonDashboardController);

    LessonDashboardController.$inject = ['LessonFactory', '$stateParams', 'localStorageService', 'StudentFactory', 'TeacherFactory'];

    /* @ngInject */
    function LessonDashboardController(LessonFactory, $stateParams, localStorageService, StudentFactory, TeacherFactory) {
        var vm = this;
        vm.title = 'LessonDashboardController';
        vm.deleteLesson = deleteLesson;
        vm.editLesson = editLesson;
        vm.searchLessons = searchLessons;
        vm.addTeacher = addTeacher;

        vm.username = localStorageService.get("username");
        vm.teacherId = localStorageService.get("teacherId");
        vm.userRole = localStorageService.get("role");

        vm.today = new Date();

        vm.startDate = vm.today;
        vm.endDate = vm.today;
        vm.studentFilter = '';
        vm.durationFilter = '';

        activate();

        ////////////////

        function activate() {
            searchLessons(vm.startDate, vm.endDate);
        }

        //Creating function to call LessonFactory's deleteLesson method to archive lessons and hide from users
        function deleteLesson(data, username) {
            var index = vm.lessons.indexOf(data);
            LessonFactory.deleteLesson(data, username).then(function(response) {

                    vm.lessonDel = response.data;
                    toastr.success('Lesson Successfully Deleted!');
                    vm.lessons.splice(index, 1);

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

            var updatedLesson = { _id: data._id, teacher: newTeacher._id, student: newStudent._id, signedInDate: moment(newDateTime, 'MM-DD-YYYY HH:mm').toDate(), duration: newDuration.value, createdBy: vm.username};
 
            //creating version history by cloning previous version history and stripping out self references to avoid JSON parsing loop
            updatedLesson.previousVersion = data.previousVersion;
            data.previousVersion = [];
            updatedLesson.previousVersion.push(data);

            LessonFactory.editLesson(updatedLesson)
                .then(function(response) { 

                        vm.newStudent = '';
                        vm.newSignInDate ='';
                        vm.newDuration = '';

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

            vm.searchQuery = { startDate: startDate, endDate: endDate, student: studentFilter, duration: durationFilter };

            if (vm.userRole === 'teacher') {
                vm.searchQuery.teacherId = vm.teacherId;
            }

            LessonFactory.searchLessons(vm.searchQuery)
                .then(function(response) {

                        vm.lessons = (response.data.lessons);
                        toastr.success('Lessons Loaded!');
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

                        vm.teachers.push(response.data.teacher);
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
