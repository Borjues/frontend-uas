angular.module("outfitologyApp").controller("ProfileController", [
  "$scope",
  "$location",
  function ($scope, $location) {
    $scope.activeTab = "create";
    $scope.createdOutfits = [];

    $scope.goBack = function () {
      $location.path("/homepage");
    };

    $scope.setTab = function (tab) {
      $scope.activeTab = tab;
    };

    $scope.outfitForm = {
      name: "",
      description: "",
      image: "",
    };

    $scope.submitOutfit = function () {
      if ($scope.outfitForm.name && $scope.outfitForm.image) {
        $scope.createdOutfits.push({
          name: $scope.outfitForm.name,
          description: $scope.outfitForm.description,
          image: $scope.outfitForm.image,
        });

        // Reset form
        $scope.outfitForm = {
          name: "",
          description: "",
          image: "",
        };
      }
    };

    $scope.showPopup = function (outfit) {
      $scope.selectedOutfit = outfit;
      $scope.showOutfitModal = true;
    };

    $scope.closePopup = function () {
      $scope.showOutfitModal = false;
      $scope.selectedOutfit = null;
    };
  },
]);
