//Creating Auth Controller to pass user inputs to Auth factory

(function() {
    'use strict';

    angular
        .module('app')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthFactory', '$state', 'localStorageService'];

    /* @ngInject */
    function AuthController(AuthFactory, $state, localStorageService) {
        var vm = this;
        vm.title = 'AuthController';
        vm.registerUser = registerUser;
        vm.loginUser = loginUser;
        vm.updateUser = updateUser;
        vm.logoutUser = logoutUser;
        vm.showLogin = showLogin;
        vm.showRegister = showRegister;

        vm.username = localStorageService.get("username");
        vm.userRole = localStorageService.get("role");
        vm.userId = localStorageService.get("_id");
        vm.userName = localStorageService.get("name");
        vm.teacherId = localStorageService.get("teacherId");

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

        $(".nav a").on("click", function() {
            $(".nav").find(".active").removeClass("active");
            $(this).parent().addClass("active");
        });

        activate();

        ////////////////

        function activate() {
            tokenExpired();
        }

        //Creating function to call AuthFactory to register new users
        function registerUser(name, email, password, confirmPassword, teacherId, role) {

            if (name && email && password && confirmPassword && teacherId && role) {

                if (password === confirmPassword) {

                    var newUser = { name: name, email: email, password: password, confirmPassword: confirmPassword, teacherId: teacherId, role: role }

                    AuthFactory.registerUser(newUser).then(function(response) {

                            toastr.success('User successfully registered!');

                            vm.newName = '';
                            vm.newEmail = '';
                            vm.newPassword = '';
                            vm.newConfirmPassword = '';
                            vm.newTeacher = '';
                            vm.newRole = '';

                        },
                        function(error) {
                            if (typeof error === 'object') {
                                toastr.error('There was an error: ' + error.data);
                            } else {
                                toastr.error(error);
                            }
                        });
                } else {
                    toastr.error('Password and Confirm Password do not match!')
                }
            } else {
                toastr.error('Please enter all required fields!')
            }
        }

        function updateUser(email, password, newPassword, newConfirmPassword) {

            if (newPassword !== newConfirmPassword) {
                toastr.error('New Password does not match Confirm Password')
            } else {
                var updatedUser = { _id: vm.userId, email: vm.username, name: vm.userName, teacherId: vm.teacherId, password: newPassword, role: vm.userRole };
                var updateUserRequest = { email: email, password: password, updatedUser: updatedUser };

                AuthFactory.updateUser(updateUserRequest)
                    .then(function(response) {

                            vm.email = '';
                            vm.password = '';
                            vm.newPassword = '';
                            vm.newConfirmPassword = '';

                            toastr.success('User Password Updated!');
                            logoutUser();
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

        //Creating function to call login user from AuthFactory and store login status
        function loginUser(loginEmail, loginPassword) {
            logoutUser();
            AuthFactory.loginUser(loginEmail, loginPassword).then(function(response) {
                    vm.username = localStorageService.get("username");
                    vm.userRole = localStorageService.get("role");
                    vm.userId = localStorageService.get("_id");
                    vm.userName = localStorageService.get("name");
                    vm.teacherId = localStorageService.get("teacherId");
                    vm.userLoggedIn = true;
                    vm.loginEmail = '';
                    vm.loginPassword = '';

                    toastr.success('User successfully logged in!');

                    if (vm.userRole === 'admin') {
                        vm.userIsAdmin = true;
                    }

                    if (vm.userRole === 'teacher' || vm.userRole === 'admin') {
                        vm.userIsTeacher = true;
                        $state.go('dashboard');

                    } else {
                        $state.go('signIns');
                    }
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.error(error);
                    }
                });
        }

        function tokenExpired() {

            var tokenExpired = AuthFactory.tokenExpired();

            if (tokenExpired) {;
                toastr.error('Access token has expired. Please log-in again!');
                logoutUser();
            }
        }

        //Defining logoutUser to call logoutUser method in AuthFactory and redirect user to home page upon clearing access_token from local storage
        function logoutUser() {
            $state.go('home');
            vm.userLoggedIn = false;
            vm.userIsTeacher = false;
            vm.userIsAdmin = false;
            AuthFactory.logoutUser();
        }

        //Defining methods to show either login or register form
        function showLogin() {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $("#login-form-link").addClass('active');
        }

        function showRegister() {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $('#register-form-link').addClass('active');
        }
    }
})();
