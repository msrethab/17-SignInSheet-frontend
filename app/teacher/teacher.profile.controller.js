(function() {
    'use strict';

    angular
        .module('app')
        .controller('TeacherProfileController', TeacherProfileController);

    TeacherProfileController.$inject = ['TeacherFactory', 'LessonFactory', 'StudentFactory', 'localStorageService'];

    /* @ngInject */
    function TeacherProfileController(TeacherFactory, LessonFactory, StudentFactory, localStorageService) {
        var vm = this;
        vm.title = 'TeacherProfileController';
        vm.updateTeacher = updateTeacher;

        activate();

        ////////////////

        function activate() {}

        //Creating function to call TeacherFactory's updateTeacher method to update Teacher
        function updateTeacher(currentTeacher, updatedTeacherInfo) {

            var updatedTeacher = currentTeacher

            if (updatedTeacherInfo) {
                Object.keys(updatedTeacher).forEach(function(key, index) {

                    if (updatedTeacherInfo[key] && updatedTeacherInfo[key] !== '') {
                        updatedTeacher[key] = updatedTeacherInfo[key];
                    }
                });

                TeacherFactory.updateTeacher(updatedTeacher)
                    .then(function(response) {
                            vm.updatedTeacher.name = '';
                            vm.updatedTeacher.email = '';
                            vm.updatedTeacher.phoneNumber = '';
                            vm.updatedTeacher.streetAddress = '';
                            vm.updatedTeacher.city = '';
                            vm.updatedTeacher.state = '';
                            vm.updatedTeacher.zip = '';
                            vm.updatedTeacher.gender = '';
                            vm.updatedTeacher.independent = '';

                            toastr.success('Teacher Profile Updated!');
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
    }
})();
