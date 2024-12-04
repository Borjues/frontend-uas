// Services

// Auth
angular.module("outfitologyApp").factory("AuthService", [
  "$http",
  "$q",
  function ($http, $q) {
    return {
      login: function (username, password) {
        return $http.post("http://localhost:4000/login", {
          username: username,
          password: password,
        });
      },

      register: function (username, email, password) {
        return $http.post("http://localhost:4000/register", {
          username: username,
          email: email,
          password: password,
        });
      },

      isLoggedIn: function () {
        return !!localStorage.getItem("user");
      },

      checkAuth: function () {
        var deferred = $q.defer();

        if (this.isLoggedIn()) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        return deferred.promise;
      },
    };
  },
]);

angular.module("outfitologyApp").factory("UnsplashService", [
  "$http",
  function ($http) {
    const UNSPLASH_ACCESS_KEY = "u5l1RpWY84DwihSsWs0KfKWfpW866WDXWkIPX19CMKA";
    const DEFAULT_SEARCH_QUERY = "fashion, streetwear, outfit, casual outfit";

    return {
      fetchImages: function (userQuery) {
        return $http({
          method: "GET",
          url: `https://api.unsplash.com/photos/random`,
          headers: {
            SameSite: "None",
            Secure: true,
          },
          params: {
            count: 30,
            query: `${userQuery}, fashion` || DEFAULT_SEARCH_QUERY,
            client_id: UNSPLASH_ACCESS_KEY,
          },
        });
      },
    };
  },
]);

// Controllers

// Home Controller
angular
  .module("outfitologyApp")
  .controller("HomeController", [
    "$scope",
    "$interval",
    function ($scope, $interval) {
      var vm = this;
      vm.currentSlide = 0;
      vm.modalOpen = false;
      vm.selectedOutfit = null;

      vm.slides = [
        {
          url: "https://plus.unsplash.com/premium_photo-1708633003273-bed7672ddd81?q=80&w=1821&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1683817138481-dcdf64a40859?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1708110920881-635419c3411f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ];

      // Load your outfit images here
      vm.outfits = [
        "https://i.pinimg.com/736x/e0/06/c7/e006c7ef8cec205365c1ac1474c41650.jpg",
        "https://i.pinimg.com/enabled_hi/564x/c3/ed/10/c3ed101126a804d5a87f913c38a14fc7.jpg",
        "https://i.pinimg.com/564x/3f/3f/ce/3f3fcebede07d307dbf6bfe6215e2e68.jpg",
        "https://i.pinimg.com/736x/49/64/79/496479a5fdb733d1d7f119bd8cf3c41d.jpg",
      ];

      vm.nextSlide = function () {
        vm.currentSlide = (vm.currentSlide + 1) % vm.slides.length;
      };

      vm.prevSlide = function () {
        vm.currentSlide =
          (vm.currentSlide - 1 + vm.slides.length) % vm.slides.length;
      };

      vm.setCurrentSlide = function (index) {
        vm.currentSlide = index;
      };

      vm.isActive = function (index) {
        return vm.currentSlide === index;
      };

      vm.openModal = function (outfit) {
        vm.selectedOutfit = outfit;
        vm.modalOpen = true;
      };

      vm.closeModal = function () {
        vm.modalOpen = false;
        vm.selectedOutfit = null;
      };

      // Auto slide
      var autoSlide = $interval(vm.nextSlide, 5000);

      // Cleanup interval on scope destroy
      $scope.$on("$destroy", function () {
        if (autoSlide) {
          $interval.cancel(autoSlide);
        }
      });
    },
  ])

  // Login Controller
  .controller("LoginController", [
    "$scope",
    "AuthService",
    "$location",
    function ($scope, AuthService, $location) {
      var vm = this;

      vm.user = {
        username: "",
        password: "",
      };

      // Function to store user data in localStorage
      function storeUserSession(userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      vm.submitForm = function () {
        if (vm.user.username && vm.user.password) {
          AuthService.login(vm.user.username, vm.user.password)
            .then(function (response) {
              // Store user session data
              const userSession = {
                username: vm.user.username,
                loginTime: new Date().toISOString(),
              };
              storeUserSession(userSession);

              swal("Success!", "Login successful.", "success").then(
                function () {
                  $location.path("/");
                  $scope.$apply();
                }
              );
            })
            .catch(function (error) {
              swal("Oops!", "Wrong username or password.", "error");
            });
        } else {
          swal("Oops!", "Please fill in both fields.", "error");
        }
      };
    },
  ])

  // Register Controller
  .controller("RegisterController", [
    "$scope",
    "AuthService",
    "$location",
    function ($scope, AuthService, $location) {
      var vm = this;

      vm.user = {
        name: "",
        email: "",
        password: "",
      };

      vm.submitForm = function () {
        AuthService.register(vm.user.name, vm.user.email, vm.user.password)
          .then(function (response) {
            swal("Success!", response.data.message, "success").then(
              function () {
                $location.path("/login");
              }
            );
          })
          .catch(function (error) {
            swal(
              "Error!",
              error.data.message || "An unknown error occurred",
              "error"
            );
          });
      };
    },
  ])

  // Profile Controller
  .controller("ProfileController", [
    "$scope",
    "$location",
    "AuthService",
    function ($scope, $location, AuthService) {
      var vm = this;

      vm.activeTab = "create";
      var currentUser = JSON.parse(localStorage.getItem("user"));

      vm.user = {
        username: currentUser ? currentUser.username : "Guest",
        profileImage: "../image/swain.jpeg",
      };

      vm.userOutfits = [];

      vm.setTab = function (tab) {
        vm.activeTab = tab;
      };

      vm.addOutfit = function () {
        // Implementation for adding new outfit
        var newOutfit = {
          name: "New Outfit",
          description: "Outfit description",
          image: "outfit-image-url",
        };
        vm.userOutfits.push(newOutfit);
      };

      vm.goBack = function () {
        $location.path("/");
      };
    },
  ])

  // Explorer Controller
  .controller("ExplorerController", [
    "$scope",
    "UnsplashService",
    "$window",
    "$document",
    "$rootScope",
    function ($scope, UnsplashService, $window, $document, $rootScope) {
      var vm = this;
      vm.page = 1;
      vm.fetching = false;
      vm.columns = [[], [], [], [], []];
      vm.isLoading = true;
      vm.isMobileMenuActive = false;
      vm.originalImages = [];

      vm.createCard = function (imageUrl, colIndex) {
        vm.columns[colIndex].push({
          imageUrl: imageUrl,
          loaded: false,
          error: false,
        });
      };

      vm.fetchImageData = function (searchQuery) {
        if (vm.fetching) return;

        vm.fetching = true;
        vm.isLoading = true;

        UnsplashService.fetchImages(searchQuery)
          .then(function (response) {
            if (response.data.length > 0) {
              vm.originalImages = vm.originalImages.concat(response.data);

              if (vm.page === 1) {
                vm.columns = [[], [], [], [], []];
              }

              response.data.forEach(function (image, index) {
                vm.createCard(image.urls.small, index % 5);
              });
            }
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
          })
          .finally(function () {
            vm.fetching = false;
            vm.isLoading = false;
          });
      };

      // Listen for search updates from rootScope
      $scope.$on("searchUpdated", function (event, searchQuery) {
        vm.page = 1;
        vm.columns = [[], [], [], [], []];
        vm.originalImages = [];
        vm.fetchImageData(searchQuery);
      });

      // Handle infinite scroll
      angular.element($window).on("scroll", function () {
        if (vm.fetching) return;

        var scrollTop =
          $window.pageYOffset || $document[0].documentElement.scrollTop;
        var windowHeight = $window.innerHeight;
        var bodyHeight = $document[0].documentElement.scrollHeight;

        if (bodyHeight - scrollTop - windowHeight < 800) {
          vm.page++;
          $scope.$apply(function () {
            vm.fetchImageData($rootScope.searchQuery);
          });
        }
      });

      // Cleanup when controller is destroyed
      $scope.$on("$destroy", function () {
        angular.element($window).off("scroll");
      });

      // Initial load
      vm.fetchImageData("");
    },
  ]);
