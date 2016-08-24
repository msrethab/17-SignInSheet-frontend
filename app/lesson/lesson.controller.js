//Creating LessonController to pass user inputs to Lesson Factory

(function() {
    'use strict';

    angular
        .module('app')
        .controller('LessonController', LessonController);

    LessonController.$inject = ['LessonFactory', '$stateParams', 'localStorageService', 'StudentFactory', 'TeacherFactory'];

    /* @ngInject */
    function LessonController(LessonFactory, $stateParams, localStorageService, StudentFactory, TeacherFactory) {
        var vm = this;
        vm.title = 'LessonController';
        vm.getLessons = getLessons;
        vm.addLesson = addLesson;
        vm.getStudents = getStudents;
        vm.addStudent = addStudent;
        vm.getTeachers = getTeachers;
        vm.getTeacherById = getTeacherById;
        vm.countLessonsByTeacher = countLessonsByTeacher;

        vm.username = localStorageService.get("username");
        vm.teacherId = localStorageService.get("teacherId");
        vm.userRole = localStorageService.get("role");

        //Checks to see if there is a stored username, if yes sets login status to true
        if (vm.username) {
            vm.userLoggedIn = true;
        }

        if (vm.userRole === 'teacher' || vm.userRole === 'admin') {
            vm.userIsTeacher = true;
        }

        if (vm.userRole === 'admin') {
            vm.userIsAdmin = true;
        }

        vm.monthFilter = moment();

        vm.durationList = [{
            name: '45 minutes',
            value: 45
        }, {
            name: '1 hour 30 minutes',
            value: 90
        }, {
            name: '2 hours 15 minutes',
            value: 135
        }, {
            name: '3 hours',
            value: 180
        }];

        activate();

        ////////////////

        function activate() {
            getTeachers();
            getStudents();

            if (vm.teacherId) {
                getTeacherById(vm.teacherId);
                countLessonsByTeacher();
            }
        }

        //Creating function to call LessonFactory's getLessons method to get and store all lessons
        function getLessons() {

            LessonFactory.getLessons()
                .then(function(response) {

                        vm.lessons = response.data.lessons;
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

        //Creating function to call LessonFactory's addLesson method to add lesson
        function addLesson(teacherId, studentId, lessonDuration, lessonDateTime) {

            if (vm.termsAccepted || vm.userRole=== 'admin' || vm.userRole === 'teacher') {
                if (teacherId && studentId && lessonDuration) {
                    var newLesson = { teacher: teacherId, student: studentId, duration: lessonDuration, createdBy: vm.username }

                    if (vm.userRole === 'teacher' || vm.userRole === 'admin') {
                        if (lessonDateTime) {
                            newLesson.signedInDate = moment(lessonDateTime, 'MM-DD-YYYY HH:mm').toDate();
                        }
                    }

                    LessonFactory.addLesson(newLesson)
                        .then(function(response) {

                                if (vm.userRole === 'user') {
                                    vm.teacherSelect = '';
                                }
                                vm.studentSelect = '';
                                vm.durationSelect = '';
                                vm.termsAccepted = false;
                                toastr.success('Thank you for signing in! Lesson created!');

                            },
                            function(error) {
                                if (typeof error === 'object') {
                                    toastr.error('There was an error: ' + error.data);
                                } else {
                                    toastr.info(error);
                                }
                            })
                } else {
                    toastr.error('Please select a teacher, student and duration!')
                }
            } else{
                toastr.error('Please accept the Terms of Service to check in!')
            }

        }

        //Creating function to call StudentFactory's getStudents method to get and store all students
        function getStudents() {

            StudentFactory.getStudents()
                .then(function(response) {

                        vm.students = response.data.students;
                        toastr.success('Students Loaded!');

                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Creating function to call StudentFactory's addStudent method to add student
        function addStudent(name, email, phoneNumber, streetAddress, city, state, zip, gender) {

            var newStudent = { name: name, email, email, phoneNumber: phoneNumber, streetAddress: streetAddress, city: city, state: state, zip: zip, gender: gender }

            StudentFactory.addStudent(newStudent)
                .then(function(response) {

                        vm.students.push(response.data.student);
                        toastr.success('New Student Registered!');

                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Creating function to call TeacherFactory's getTeachers method to get and store all teachers
        function getTeachers() {

            TeacherFactory.getTeachers()
                .then(function(response) {

                        vm.teachers = response.data.teachers;
                        toastr.success('Teachers Loaded!');

                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Creating function to call TeacherFactory's getTeacherById method to get currentUser's teacher
        function getTeacherById(teacherId) {

            TeacherFactory.getTeacherById(teacherId)
                .then(function(response) {

                        vm.currentTeacher = response.data.teacher;
                        toastr.success('Current Teacher Loaded!');
                        if (vm.userRole = 'teacher') {
                            vm.teacherSelect = vm.currentTeacher;
                        }

                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        function countLessonsByTeacher(monthFilter) {

            LessonFactory.countLessonsByTeacher(monthFilter)
                .then(function(response) {

                        vm.teachers.forEach(function(teacher, teacherIndex) {
                            teacher.lessonCount = 0;
                            response.data.lessons.forEach(function(lessonCount, lessonCountIndex) {
                                if (teacher._id === lessonCount._id) {
                                    teacher.lessonCount = lessonCount.count;
                                }
                            })
                        })

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
