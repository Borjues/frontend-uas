angular.module("outfitologyApp").controller("HomeController", [
  "$scope",
  "$interval",
  function ($scope, $interval) {
    $scope.slideIndex = 0;
    $scope.slides = [0, 1, 2]; // Slide indices

    $scope.nextSlide = function () {
      $scope.slideIndex = ($scope.slideIndex + 1) % 3;
      $scope.updateSlide();
    };

    $scope.prevSlide = function () {
      $scope.slideIndex = ($scope.slideIndex - 1 + 3) % 3;
      $scope.updateSlide();
    };

    $scope.setCurrentSlide = function (index) {
      $scope.slideIndex = index;
      $scope.updateSlide();
    };

    $scope.isActive = function (index) {
      return $scope.slideIndex === index;
    };

    $scope.updateSlide = function () {
      $scope.slideTransform = `translateX(-${($scope.slideIndex * 100) / 3}%)`;
    };

    // Auto slide
    var autoSlide = $interval($scope.nextSlide, 5000);

    // Cleanup interval on scope destroy
    $scope.$on("$destroy", function () {
      if (autoSlide) {
        $interval.cancel(autoSlide);
      }
    });

    // Image modal
    $scope.selectedImage = null;
    $scope.showModal = false;

    $scope.openModal = function (image) {
      $scope.selectedImage = image;
      $scope.showModal = true;
    };

    $scope.closeModal = function () {
      $scope.showModal = false;
      $scope.selectedImage = null;
    };

    // Initialize first slide
    $scope.updateSlide();
  },
]);
