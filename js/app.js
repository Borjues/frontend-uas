angular
  .module("outfitologyApp", ["ngRoute"])
  .config([
    "$routeProvider",
    "$locationProvider",
    function ($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix("!");

      $routeProvider
        .when("/", {
          templateUrl: "views/homepage.html",
          controller: "HomeController",
          controllerAs: "home",
        })
        .when("/login", {
          templateUrl: "views/login.html",
          controller: "LoginController",
          controllerAs: "login",
        })
        .when("/register", {
          templateUrl: "views/register.html",
          controller: "RegisterController",
          controllerAs: "register",
        })
        .when("/profile", {
          templateUrl: "views/profile.html",
          controller: "ProfileController",
          controllerAs: "profile",
          resolve: {
            // Contoh authentication check
            auth: [
              "$location",
              "AuthService",
              function ($location, AuthService) {
                return AuthService.checkAuth().catch(function () {
                  $location.path("/login");
                });
              },
            ],
          },
        })
        .when("/explore", {
          templateUrl: "views/explore.html",
          controller: "ExplorerController",
          controllerAs: "explore",
        })
        .otherwise({
          redirectTo: "/",
        });
    },
  ])
  .run([
    "$rootScope",
    "$location",
    "AuthService",
    function ($rootScope, $location, AuthService) {
      // Handle route change events
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
        // Update loading state
        $rootScope.isLoading = true;

        // Example: Check if user is logged in
        $rootScope.isLoggedIn = AuthService.isLoggedIn();
      });

      $rootScope.$on("$routeChangeSuccess", function () {
        // Hide loading when route change is complete
        $rootScope.isLoading = false;

        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Dynamic CSS
        var viewStyleMap = {
          "/": "style/style.css",
          "/login": "style/loginstyle.css",
          "/register": "style/registerstyle.css",
          "/profile": "style/profilestyle.css",
          "/explore": "style/style.css",
        };

        var stylePath = viewStyleMap[$location.path()] || "views/style.css";
        document.getElementById("dynamic-style").setAttribute("href", stylePath);
      });

      $rootScope.$on("$routeChangeError", function () {
        // Handle route change errors
        $rootScope.isLoading = false;
        $location.path("/");
      });
    },
  ]);
