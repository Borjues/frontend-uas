angular.module("outfitologyApp", ["ngRoute"]).config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/homepage.html",
        controller: "HomeController",
      })
      .when("/login", {
        templateUrl: "views/login.html",
        controller: "LoginController",
      })
      .when("/register", {
        templateUrl: "views/create-account.html",
        controller: "RegisterController",
      })
      .when("/profile", {
        templateUrl: "views/profile.html",
        controller: "ProfileController",
      })
      .when("/explore", {
        templateUrl: "views/explore.html",
        controller: "ExploreController",
      })
      .otherwise({ redirectTo: "/" });
  },
]);
