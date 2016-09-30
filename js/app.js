//Define an angular module for our app
//var farmer = angular.module('farmer', ['ionic']);

var farmer = angular.module('farmer', ['ionic']);


farmer.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
   // $rootScope.isCheckout = false;
    $rootScope.selectedProducts ={};
    $rootScope.noOfSelectedProducts = 0;
    $rootScope.totalPrice = 0;
    $rootScope.showCheckout = true;
})
//Define Routing for app

farmer.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    templateUrl: 'templates/app/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/home.html',
        controller: 'homeController'
      }
    }
  })

  .state('app.subcat', {
    url: '/subcat/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/subCategory.html',
        controller: 'subcategoryController'
      }
    }
  })

  .state('app.plp', {
    url: '/plp/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/plp.html',
        controller: 'plpController'
      }
    }
  })

  .state('app.pdp', {
    url: '/pdp/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/pdp.html',
        controller: 'pdpController'
      }
    }
  })

  .state('app.checkout', {
    url: '/checkout',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/checkout.html',
        controller: 'checkoutController'
      }
    }
  })

  .state('app.address', {
    url: '/address',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/address.html',
        controller: 'addressController'
      }
    }
  })

  .state('app.thankyou', {
    parent: 'app',
    url: '/thankyou/:oId',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/thankyou.html',
        controller: 'thankyouController'
      }
    }
  })
  .state('app.contactus', {
    parent: 'app',
    url: '/contactus',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/contactus.html',
        controller: 'contactusController'
      }
    }
  })
  .state('app.developed', {
    parent: 'app',
    url: '/developed',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/developed.html',
        controller: 'developedController'
      }
    }
  })

  .state('app.fbconnect', {
    parent: 'app',
    url: '/fbconnect',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/fbconnect.html',
        controller: 'connectfbController'
      }
    }
  })

  .state('app.continue', {
    url: '/continue',
    views: {
      'menuContent': {
        controller: 'continueController'
      }
    }
  })

  .state('app.signup', {
        url: '/signup',
        views: {
            'menuContent': {
                templateUrl: 'templates/app/signup.html'
            }
        }
    })

  $urlRouterProvider.otherwise('/app/home');
    });

farmer.factory('Data', function () {
    return { 'selectedProducts': {}, 'plpID':'' };
});


farmer.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http,$ionicHistory,$rootScope,$state,$window) {
   // console.log("Controller Started");

    $scope.loginData = {};
    $scope.loginForm = { error: 'hide', errorMsg:""};
    $scope.signupForm = {error : 'show', errorMsg : "All fields are mandatory"};
    $scope.user = { notLogin: true, loggedIn: false}

    $scope.goBack = function(){
        if($ionicHistory.currentView().stateName == 'app.thankyou'){
        $window.location.href = 'index.html';
        }
        else{
         $ionicHistory.goBack();
        var a  = $ionicHistory.currentView();
        if($ionicHistory.currentView().stateName != 'app.address'){
        if($rootScope.noOfSelectedProducts >0){
            $rootScope.showCheckout = true;

        }
        }
        }


    }
    $http.post('http://139.59.183.156/riddhi/www/server/user/authenticateUser.php').success(function (result) {
        if (result.valid) {
            $scope.user = { notLogin: false, loggedIn: true}
            $scope.user.email = result.email
        }
        else{
            $scope.user = { notLogin: true, loggedIn: false}
        };
    })

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/app/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
    $scope.doLogin = function(data) {
        if (data.password.length < 7) {
            $scope.loginForm = {error : 'show', errorMsg : "password length must be greater than 7"};
        }
        else{
            $http.post('http://139.59.183.156/riddhi/www/server/user/login.php', data).success(function (result) {
                if (result.valid) {
                    $scope.user.notLogin = false;
                    $scope.user.loggedIn = true;
                    $scope.user.email = data.email
                    $scope.modal.hide();
                }
                else{
                    $scope.loginForm = { error: 'show', errorMsg:result.error};
                };
            })
        };
    };


    $scope.signup = function (userData) {

        if(userData === undefined){
            $scope.signupForm = {error : 'show', errorMsg : "Fill all * marked fields"};
        }
        else if (Object.keys(userData).length != 6) {
            $scope.signupForm = {error : 'show', errorMsg : "Fill all * marked fields"};
        }
        else if(userData.phone.toString().length != 10) {
            $scope.signupForm = {error : 'show', errorMsg : "Phone number is not valid"};
        }
        else if(userData.pass != userData.repass) {
            $scope.signupForm = {error : 'show', errorMsg : "Password and Confirm Password does not match."};
        }
        else{
            $http.post('http://139.59.183.156/riddhi/www/server/user/signup.php', userData).success(function(result){
                if(result.valid){
                    window.location.assign(window.location.origin + window.location.pathname + "#/app/home")
                    $scope.modal.show()
                    $scope.signupForm = {error : 'show', errorMsg : "All fields are mandatory"};
                }
                else{
                    $scope.signupForm = {error : 'show', errorMsg : result.error};
                }
            })
        }
    }


    $scope.logout = function () {
        $http.post('http://139.59.183.156/riddhi/www/server/user/logout.php').success(function (result) {
            if (result.valid) {
                $scope.user.notLogin = true;
                $scope.user.loggedIn = false;
                $scope.user.id = '';

            } else{
                alert("Cannot log out");
            };
        })
    }

})

farmer.controller('homeController', function($scope,$http,$rootScope) {
    $rootScope.showCheckout = true;
    $http.get('json/categoriesDetails.json',{}).success(function(data){
			$scope.categories = data;
		});
});
farmer.service('CategoryService', function(){
  this.cId;
  this.subCatId;
});

farmer.controller('subcategoryController', function($scope,$http,$stateParams,$rootScope, CategoryService) {
    $rootScope.showCheckout = true;
    $scope.catID = $stateParams.id;

    var loader  = document.getElementById('loader');

    let prop;
    for (prop in $stateParams) {
      prop = prop;
    }
    if(prop == "id")
    {
      $http.post('http://139.59.183.156/riddhi/www/server/category/getAllSubCategorysInCategory.php', {cId: $stateParams.id}).success(function(result){
          if(result.valid){
            $scope.subCategories = result.data;
              }
          else{
            alert(result.error);
          }
          loader.style.display = 'none';
      });
    }
    else
    {
      $http.post('http://139.59.183.156/riddhi/www/server/category/getAllProductsInSubCategory.php', {cId: $stateParams.id}).success(function(result){
          if(result.valid){
            // $scope.subCategories = result.data;
          }
          else{
            alert(result.error);
          }
          loader.style.display = 'none';
      });
    }
});

farmer.controller('plpController',function($scope,Data,$http,$stateParams,$location,$rootScope) {
    $rootScope.showCheckout = true;
    var loader  = document.getElementById('loader1');
    Data.plpID = $stateParams.id;
    $scope.sucCatId = $stateParams.id;

    let isCategory = false;

    /*$http.post('server/category/getAllProductsInCategory.php', {cId: $stateParams.id}).success(function(result){
        if(result.valid){
          $scope.productByCate = result.data;
          loader.style.display = 'none';
          isCategory = true
        }

    });*/

    $http.post('http://139.59.183.156/riddhi/www/server/category/getAllProductsInSubCategory.php', {subCatId: $stateParams.id}).success(function(result){
          if(result.valid && !isCategory){
            $scope.productByCate = result.data;
            loader.style.display = 'none';
          }
          else{
            alert(result.error);
          }
          loader.style.display = 'none';
      });

    $scope.pdpLocation = function(pdpURL) {
        $rootScope.showCheckout = true;
        window.location.href='#/app/pdp/'+pdpURL;
    }

    $scope.deleteOne = function() {
        /*console.log("Deleted Successfully");*/
    }

    $scope.changeQuantity = function(product,change){
        event.currentTarget.parentElement.parentElement.classList.remove("activated");
        if(!$rootScope.selectedProducts[product.pId]){
          var a={
            qty : 0,
            pName: product.pName,
            text1: product.text1,
            price: product.price,
            mrp: product.mrp,
            id: product.pId,
            pImage: product.pImage,
            subCategoryId: product.pImage.split('_')[1]
          };

          $rootScope.selectedProducts[product.pId] = a;
        }
        if(change == 'inc'){
            $rootScope.selectedProducts[product.pId].qty = $rootScope.selectedProducts[product.pId].qty +1;
            if($rootScope.showCheckout == false){
                $rootScope.showCheckout = true;
            }
            
        }
        if(change == 'dec' && $rootScope.selectedProducts[product.pId].qty!=0){
            $rootScope.selectedProducts[product.pId].qty = $rootScope.selectedProducts[product.pId].qty -1;
        }
        if($rootScope.selectedProducts[product.pId].qty == 0){
            delete $rootScope.selectedProducts[product.pId];
        }
        $rootScope.noOfSelectedProducts = Object.keys($rootScope.selectedProducts).length;
        };
});

farmer.controller('pdpController',function($scope,Data,$http,$stateParams,$location,$rootScope){
    // $rootScope.loader.style.display = 'block';

    $http.post('http://139.59.183.156/riddhi/www/server/product/getProductDetails.php', $stateParams).success(function (result) {
        if(result.valid){
            $scope.pdpProduct = result.data;
        }
        else{
            alert(result.error);
        }
    })
    // $http.get('http://www.brbangles.com/json/category'+Data.plpID+'Details.json',{}).success(function(data){
    //         $scope.productByCate = data;
    //         for(i=0;i<data.length;i++){
    //             if(data[i].id == $stateParams.id){
    //                 $scope.pdpProduct = data[i];
    //                 break;
    //             }
    //         }
    //     $rootScope.loader.style.display = 'none';
    //     });

    // $scope.changeQuantity = function(product,change){
    //     event.currentTarget.parentElement.parentElement.classList.remove("activated");
    //     if(!$rootScope.selectedProducts[product.id]){
    //       var a={
    //         qty : 0,
    //         name: product.name,
    //         price: product.price,
    //         id: product.id
    //       };

    //       $rootScope.selectedProducts[product.id] = a;
    //       console.log("$rootScope.selectedProducts[product.id]" + $rootScope.selectedProducts[product.id]);
    //     }
    //     if(change == 'inc'){
    //         $rootScope.selectedProducts[product.id].qty = $rootScope.selectedProducts[product.id].qty +1;
    //     }
    //     if(change == 'dec' && $rootScope.selectedProducts[product.id].qty!=0){
    //         $rootScope.selectedProducts[product.id].qty = $rootScope.selectedProducts[product.id].qty -1;
    //     }
    //     if($rootScope.selectedProducts[product.id].qty == 0){
    //         delete $rootScope.selectedProducts[product.id];
    //     }
    //     $rootScope.noOfSelectedProducts = Object.keys($rootScope.selectedProducts).length;
    // };

    // $scope.goBack = function() {
    //     window.history.back();
    // }

});

farmer.controller('checkoutController',function($scope,$rootScope,$http,$location) {

   if($rootScope.showCheckout == true){
       $rootScope.showCheckout = false;
   }
    $rootScope.showCouponCode = true;
    $rootScope.totalPrice = 0;

    for (i=0;i<Object.keys($rootScope.selectedProducts).length;i++){
        $rootScope.totalPrice = $rootScope.totalPrice+              ($rootScope.selectedProducts[Object.keys($rootScope.selectedProducts)[i]].qty) *                                             ($rootScope.selectedProducts[Object.keys($rootScope.selectedProducts)[i]].price);


        }
   // $rootScope.netAmount = $rootScope.totalPrice;

      $scope.deleteCheckout = function(product){
          if($rootScope.totalPrice <500){
              console.log("less"+$rootScope.totalPrice);
              
              $scope.showCouponCode = false;
              //result.discount;
              $rootScope.discount = 0;
          }
          
          $rootScope.totalPrice = $rootScope.totalPrice - ((($rootScope.selectedProducts[product.id]).qty)*            (($rootScope.selectedProducts[product.id]).price));
           $rootScope.netAmount = $rootScope.netAmount - ((($rootScope.selectedProducts[product.id]).qty)*            (($rootScope.selectedProducts[product.id]).price));
          
          
         delete $rootScope.selectedProducts[product.id];
         $rootScope.noOfSelectedProducts = Object.keys($rootScope.selectedProducts).length;

      };



    $scope.applyCoupon = function(couponCode,totalPrice){
        
        var req = {
        method: 'POST',
        url: 'http://139.59.183.156/riddhi/www/server/checkCouponCode.php',
        data: {'totalPrice':totalPrice,'couponCode':couponCode},
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    };
      $http(req).success(function(result){
          console.log(result);
        if (result.status) {
          //loader.style.display = 'none';
            $rootScope.discount = result.discount;
          $rootScope.netAmount = $rootScope.totalPrice - result.discount;
            $scope.message = 'Coupon Code has been Applied Successfully';
        }
          else{
            $scope.message = 'Sorry Coupon Code is Not valid';
          }

      }

      )
       /* var valid = true;
        $rootScope.discount = 50;
        if (valid) {
          //loader.style.display = 'none';
          $rootScope.netAmount = $rootScope.totalPrice - $rootScope.discount;
            $scope.message = 'Coupon Code has been Applied Successfully';
        }
          else{
            $scope.message = 'Sorry Coupon Code is Not valid';
          }*/

    }

});

farmer.controller('addressController',function($scope,$rootScope,$http,$location){
    $scope.details = {};
    $scope.details.name = localStorage.getItem('usersname');
    $scope.details.phoneNumber = localStorage.getItem('usersPhone');
    $scope.details.address = localStorage.getItem('usersAddress');
   // $rootScope.showCheckout = false;
    if($rootScope.showCheckout == true){
       $rootScope.showCheckout = false;
   }

   // var ref = new Firebase("https://scorching-inferno-9276.firebaseio.com");
    var loader  = document.getElementById('loader3');
    var overlay = document.getElementById('overlay');
    $scope.submitOrder = function(){


        if($scope.details.name == undefined || $scope.details.phoneNumber == undefined || $scope.details.address == undefined){
            $scope.error = "Please Enter All Mendatory Details";
        }
        else {
        loader.style.display = 'block';
        overlay.style.display = 'block';

        localStorage.setItem('usersname', $scope.details.name);
        localStorage.setItem('usersPhone', $scope.details.phoneNumber);
        localStorage.setItem('usersAddress', $scope.details.address);
        var orederDetails = {selectedProducts:$rootScope.selectedProducts,totalPrice:$rootScope.totalPrice,details:$scope.details};

        var req = {
        method: 'POST',
        url: 'http://139.59.183.156/riddhi/www/server/phpwithMongo.php',
        url: 'http://139.59.183.156/riddhi/www/server/phpwithMongo.php',
        data: {'selectedProducts':$rootScope.selectedProducts,'totalPrice':$rootScope.totalPrice,'discount':$rootScope.discount,'netAmount':$rootScope.netAmount,'details':$scope.details,'totalProducts':$rootScope.noOfSelectedProducts},
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    };
      $http(req).success(function(result){
        if (result.valid) {

          //loader.style.display = 'none';
          $location.path('/app/thankyou/'+result.data)
        }

      }

      )

        };
    }
});

farmer.controller('thankyouController',function($scope, $rootScope,$window, $stateParams){

    $scope.order = {
      oId:$stateParams.oId
    }

       delete $rootScope.selectedProducts;
        $rootScope.noOfSelectedProducts = 0;

     //   $window.location.href = 'index.html';
});

farmer.controller('contactusController',function($rootScope,$window,$scope){
    $scope.queryData = {};

       /*delete $rootScope.selectedProducts;
        $rootScope.noOfSelectedProducts = 0;*/
        $scope.sendContactsData = function() {
        }

     //   $window.location.href = 'index.html';
});

farmer.controller('developedController',function($rootScope,$window){

       /*delete $rootScope.selectedProducts;
        $rootScope.noOfSelectedProducts = 0;*/


     //   $window.location.href = 'index.html';
});
farmer.controller('connectfbController',function($rootScope,$window){

       /*delete $rootScope.selectedProducts;
        $rootScope.noOfSelectedProducts = 0;*/


     //   $window.location.href = 'index.html';
});




farmer.controller('continueController',function($window){
    $window.location.href = 'index.html';

});
