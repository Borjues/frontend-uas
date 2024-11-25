angular.module("outfitologyApp").controller("HomeController", [
  "$scope",
  "$interval",
  function ($scope, $interval) {
    var vm = this;
    vm.currentSlide = 0;
    vm.modalOpen = false;
    vm.selectedOutfit = null;

    vm.slides = [
      { url: "https://plus.unsplash.com/premium_photo-1708633003273-bed7672ddd81?q=80&w=1821&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { url: "https://plus.unsplash.com/premium_photo-1683817138481-dcdf64a40859?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { url: "https://plus.unsplash.com/premium_photo-1708110920881-635419c3411f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ];

    // Load your outfit images here
    vm.outfits = [
      "https://i.pinimg.com/736x/e0/06/c7/e006c7ef8cec205365c1ac1474c41650.jpg",
      "https://i.pinimg.com/enabled_hi/564x/c3/ed/10/c3ed101126a804d5a87f913c38a14fc7.jpg",
      "https://i.pinimg.com/564x/3f/3f/ce/3f3fcebede07d307dbf6bfe6215e2e68.jpg",
      "https://i.pinimg.com/736x/49/64/79/496479a5fdb733d1d7f119bd8cf3c41d.jpg",
    ]; // Add your outfit images array here

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
]);
