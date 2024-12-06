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
angular
  .module("outfitologyApp")
  .controller("HomeController", [
    "$scope",
    "$interval",
    "$http",
    function ($scope, $interval, $http) {
      var vm = this;

      // Initialize variables
      vm.currentSlide = 0;
      vm.modalOpen = false;
      vm.selectedOutfit = null;
      vm.userOutfits = [];

      // Slider images
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

      // Outfit images
      vm.outfits = [
        {
          url: "https://i.pinimg.com/736x/e0/06/c7/e006c7ef8cec205365c1ac1474c41650.jpg",
          alt: "Outfit 1",
          caption: "Stylish Summer Outfit",
          comments: [], // Array to hold comments
          newComment: "", // Input for adding a new comment
          likeCount: 0, // Counter for likes
          liked: false, // Boolean to track like status
        },
        {
          url: "https://i.pinimg.com/564x/c3/ed/10/c3ed101126a804d5a87f913c38a14fc7.jpg",
          alt: "Outfit 2",
          caption: "Casual Chic Look",
          comments: [],
          newComment: "",
          likeCount: 0,
          liked: false,
        },
        {
          url: "https://i.pinimg.com/564x/3f/3f/ce/3f3fcebede07d307dbf6bfe6215e2e68.jpg",
          alt: "Outfit 3",
          caption: "Elegant Party Dress",
          comments: [],
          newComment: "",
          likeCount: 0,
          liked: false,
        },
        {
          url: "https://i.pinimg.com/736x/49/64/79/496479a5fdb733d1d7f119bd8cf3c41d.jpg",
          alt: "Outfit 4",
          caption: "Urban Streetwear",
          comments: [],
          newComment: "",
          likeCount: 0,
          liked: false,
        },
      ];

      vm.fetchOutfits = function () {
        $http
          .get("http://localhost:4000/outfits")
          .then(function (response) {
            vm.userOutfits = response.data.map(function (outfit) {
              return {
                url: outfit.image,
                outfitName: outfit.name, // Add outfit name
                description: outfit.description,
                username: outfit.user.username,
                comments: [],
                newComment: "",
                likeCount: 0,
                liked: false,
              };
            });
          })
          .catch(function (error) {
            console.error("Error fetching outfits:", error);
          });
      };

      // Call fetchOutfits when controller initializes
      vm.fetchOutfits();

      // Open modal
      vm.openImage = function (outfit) {
        vm.selectedOutfit = outfit;
        vm.modalOpen = true;
      };

      // Close modal
      vm.closeModal = function () {
        vm.modalOpen = false;
        vm.selectedOutfit = null;
      };

      // Toggle like for a specific outfit
      vm.toggleLike = function (outfit) {
        outfit.liked = !outfit.liked; // Toggle the liked status
        outfit.likeCount += outfit.liked ? 1 : -1; // Update the like count
      };

      // Add comment for a specific outfit
      vm.addComment = function (outfit) {
        if (outfit.newComment.trim() !== "") {
          outfit.comments.push({ user: "User", text: outfit.newComment }); // Add comment to the specific outfit
          outfit.newComment = ""; // Clear the input field
        }
      };

      // Functions for slider navigation
      vm.nextSlide = function () {
        vm.currentSlide = (vm.currentSlide + 1) % vm.slides.length;
      };

      vm.prevSlide = function () {
        vm.currentSlide = (vm.currentSlide - 1 + vm.slides.length) % vm.slides.length;
      };

      vm.setCurrentSlide = function (index) {
        vm.currentSlide = index;
      };

      vm.isActive = function (index) {
        return vm.currentSlide === index;
      };

      // Auto slide interval (5 seconds)
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

              swal("Success!", "Login successful.", "success").then(function () {
                $location.path("/");
                $scope.$apply();
              });
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
            swal("Success!", response.data.message, "success").then(function () {
              $location.path("/login");
              $scope.$apply();
            });
          })
          .catch(function (error) {
            swal("Error!", error.data.message || "An unknown error occurred", "error");
          });
      };
    },
  ])

  // Profile Controller
  .controller("ProfileController", [
    "$location",
    "$http",
    "AuthService",
    function ($location, $http, AuthService) {
      var vm = this;

      vm.activeTab = "created";
      vm.isEditUsernameVisible = false;
      vm.newUsername = "";
      vm.userOutfits = [];
      vm.isPopupVisible = false;
      vm.newOutfit = {
        name: "",
        description: "",
        image: "",
      };

      vm.logout = function () {
        localStorage.removeItem("user");

        $location.path("/login");
      };

      vm.openEditUsername = function () {
        if (!AuthService.isLoggedIn()) {
          swal("Error!", "Please login first", "error");
          $location.path("/login");
          return;
        }
        vm.newUsername = vm.user.username;
        vm.isEditUsernameVisible = true;
      };

      vm.closeEditUsername = function (event) {
        if (event && event.target === event.currentTarget) {
          vm.isEditUsernameVisible = false;
        } else if (!event) {
          vm.isEditUsernameVisible = false;
        }
      };

      vm.updateUsername = function () {
        if (!vm.newUsername.trim()) {
          swal("Error!", "Username cannot be empty", "error");
          return;
        }

        $http
          .put(`http://localhost:4000/user/${vm.user._id}`, {
            username: vm.newUsername,
          })
          .then(function (response) {
            // Update local storage with new username
            const userData = JSON.parse(localStorage.getItem("user"));
            userData.username = vm.newUsername;
            localStorage.setItem("user", JSON.stringify(userData));

            // Update the user object in the controller
            vm.user.username = vm.newUsername;

            swal("Success!", "Username updated successfully", "success");
            vm.closeEditUsername();
          })
          .catch(function (error) {
            swal("Error!", error.data.message || "Failed to update username", "error");
          });
      };

      vm.deleteAccount = function () {
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover your account and all your created outfits!",
          icon: "warning",
          buttons: ["Cancel", "Yes, delete my account"],
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            $http
              .delete(`http://localhost:4000/user/${vm.user._id}`)
              .then(function (response) {
                vm.isEditUsernameVisible = false;
                localStorage.removeItem("user");
                $location.path("/login");
              })
              .catch(function (error) {
                swal("Error!", "Failed to delete account", "error");
              });
          }
        });
      };

      // Function to fetch user data and outfits
      vm.fetchUserData = function () {
        const currentUsername = JSON.parse(localStorage.getItem("user"))?.username;
        if (!currentUsername) return;

        // Get user data
        $http
          .get(`http://localhost:4000/user/${currentUsername}`)
          .then(function (response) {
            vm.user = response.data;
            return $http.get(`http://localhost:4000/outfits/user/${vm.user._id}`);
          })
          .then(function (response) {
            vm.userOutfits = response.data;
          })
          .catch(function (error) {
            console.error("Error:", error);
            if (!AuthService.isLoggedIn()) {
              $location.path("/login");
            }
          });
      };

      // Call fetchUserData when controller initializes
      vm.fetchUserData();

      vm.openCreatePopup = function () {
        if (!AuthService.isLoggedIn()) {
          swal("Error!", "Please login first", "error");
          $location.path("/login");
          return;
        }
        vm.isPopupVisible = true;
      };

      vm.closePopup = function (event) {
        if (event && event.target === event.currentTarget) {
          vm.isPopupVisible = false;
          vm.newOutfit = { name: "", description: "", image: "" };
        } else if (!event) {
          vm.isPopupVisible = false;
          vm.newOutfit = { name: "", description: "", image: "" };
        }
      };

      vm.submitOutfit = function () {
        if (!AuthService.isLoggedIn()) {
          swal("Error!", "Please login first", "error");
          $location.path("/login");
          return;
        }

        if (!vm.newOutfit.name || !vm.newOutfit.description || !vm.newOutfit.image) {
          swal("Error!", "Please fill all fields", "error");
          return;
        }

        const outfitData = {
          name: vm.newOutfit.name,
          description: vm.newOutfit.description,
          image: vm.newOutfit.image,
          userId: vm.user._id,
        };

        $http
          .post("http://localhost:4000/outfits", outfitData)
          .then(function (response) {
            swal("Success!", "Outfit created successfully", "success");
            vm.closePopup();
            vm.fetchUserData(); // Refresh semua data
          })
          .catch(function (error) {
            console.error("Error creating outfit:", error);
            swal("Error!", error.data?.message || "Failed to create outfit", "error");
          });
      };

      vm.setTab = function (tab) {
        vm.activeTab = tab;
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

        var scrollTop = $window.pageYOffset || $document[0].documentElement.scrollTop;
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
