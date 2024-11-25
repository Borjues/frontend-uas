angular.module("outfitologyApp").controller("ProfileController", [
  "$scope",
  "$location",
  "AuthService",
  function ($scope, $location, AuthService) {
    var vm = this;

    vm.activeTab = "create";
    vm.user = {
      username: "admin",
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
]);
