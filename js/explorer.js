angular.module("outfitologyApp").controller("ExplorerController", [
  "$scope",
  "UnsplashService",
  "$window",
  "$document",
  function ($scope, UnsplashService, $window, $document) {
    var vm = this;
    vm.page = 1;
    vm.fetching = false;
    vm.columns = [[], [], [], [], []]; // 5 columns
    vm.isLoading = true;
    vm.isMobileMenuActive = false;

    vm.createCard = function (imageUrl, colIndex) {
      vm.columns[colIndex].push({
        imageUrl: imageUrl,
        loaded: false,
        error: false,
      });
    };

    vm.fetchImageData = function () {
      if (vm.fetching) return;

      vm.fetching = true;
      vm.isLoading = true;

      UnsplashService.fetchImages()
        .then(function (response) {
          if (response.data.length > 0) {
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

    vm.toggleMobileMenu = function () {
      vm.isMobileMenuActive = !vm.isMobileMenuActive;
    };

    // Handle infinite scroll
    angular.element($window).on("scroll", function () {
      if (vm.fetching) return;

      var scrollTop = $window.pageYOffset || $document[0].documentElement.scrollTop;
      var windowHeight = $window.innerHeight;
      var bodyHeight = $document[0].documentElement.scrollHeight;

      if (bodyHeight - scrollTop - windowHeight < 800) {
        vm.page++;
        $scope.$apply(function () {
          vm.fetchImageData();
        });
      }
    });

    // Cleanup when controller is destroyed
    $scope.$on("$destroy", function () {
      angular.element($window).off("scroll");
    });

    // Initial load
    vm.fetchImageData();
  },
]);
