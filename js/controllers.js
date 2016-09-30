angular.module('starter.controllers', [])

    .controller('AppCtrl', appCtrl)

function appCtrl($scope, $ionicModal, $timeout, $http, UserFactory) {

    $scope.loginData = {};
    var error_msg = '';
    $scope.signupForm = {error : 'hide', errorMsg : error_msg};
    $scope.loginForm = { error: '', errorMsg: error_msg};
    $scope.user = { notLogin: true, loggedIn: false}

    $ionicModal.fromTemplateUrl('templates/login.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modalLogin = modal;
    });

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modalSignup = modal;
    });

    $scope.closeModal = function(id) {
        if (id==1) {
        $scope.modalLogin.hide();
        } else{
        $scope.modalSignup.hide();
        };
    };

    $scope.login = function(id) {
        if (id==1) {
        $scope.modalLogin.show();
        startApp();
        } else{
        $scope.modalSignup.show();
        };
    };


    $scope.signup = function (userData) {

        UserFactory.validate(userData, 6, $scope.signupForm, function(result){
            if(result.valid){
                if(userData.pass !== userData.repass){
                    UserFactory.showErr($scope.signupForm, "Password should be same.");
                }
                else{
                    UserFactory.removeErr($scope.signupForm);    
                    UserFactory.postData('php/signup.php', userData, $scope.signupForm, function(result){
                        if(!result.error){
                            $scope.modalSignup.hide();
                            $scope.modalLogin.show();
                        }
                    });
                }
            }
        });
        
    }


    $scope.login = function (loginData) {
        UserFactory.validate(loginData, 2, $scope.loginForm, function(result){
            if(result.valid){
                UserFactory.postData('php/login.php', loginData, $scope.loginForm, function(result){
                    if(!result.error){
                        $scope.user.notLogin = false;
                        $scope.user.loggedIn = true;
                        $scope.user.id = result.$id;
                        $scope.modalLogin.hide();
                    }
                });
            }
        });
    }


    $scope.logout = function () {
        $http.post('php/logout.php', '').then(function (response) {
        $scope.user.notLogin = true;
        $scope.user.loggedIn = false;
        $scope.user.id = '';
        })
    }

    // var googleUser = {};
    // var startApp = function() {
    // gapi.load('auth2', function(){
    // // Retrieve the singleton for the GoogleAuth library and set up the client.
    // auth2 = gapi.auth2.init({
    // client_id: '753656321853-rrrg8tnsg8obdutt6qmfg72it6ijevc4.apps.googleusercontent.com',
    // cookiepolicy: 'single_host_origin',
    // // Request scopes in addition to 'profile' and 'email'
    // //scope: 'additional_scope'
    // });
    // attachSignin(document.getElementById('googleSigninBtn'));
    // });
    // };

    // function attachSignin(element) {
    //     auth2.attachClickHandler(element, {},
    //     function(googleUser) {
    //         document.getElementById('name').innerText = "Signed in: " +
    //   googleUser.getBasicProfile().getName();
    //     }, function(error) {
    //         alert(JSON.stringify(error, undefined, 2));
    //     });
    //     }
}
