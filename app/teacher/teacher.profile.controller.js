(function() {
    'use strict';

    angular
        .module('app')
        .controller('TeacherProfileController', TeacherProfileController);

    TeacherProfileController.$inject = ['$scope', 'TeacherFactory', 'LessonFactory', 'StudentFactory', 'localStorageService'];

    /* @ngInject */
    function TeacherProfileController($scope, TeacherFactory, LessonFactory, StudentFactory, localStorageService) {
        var vm = this;
        vm.title = 'TeacherProfileController';
        vm.updateTeacher = updateTeacher;

        activate();

        ////////////////

        function activate() {}

        //Creating function to call TeacherFactory's updateTeacher method to update Teacher
        function updateTeacher(currentTeacherEdited) {

            TeacherFactory.updateTeacher(currentTeacherEdited)
                .then(function(response) {

                        $scope.vm.currentTeacher = response.data.teacher;
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
})();
