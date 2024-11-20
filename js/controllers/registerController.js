angular.module("outfitologyApp").controller("RegisterController", [
  "$scope",
  "AuthService",
  function ($scope, AuthService) {
    $scope.formData = {
      username: "",
      email: "",
      password: "",
    };

    $scope.register = function () {
      AuthService.register($scope.formData.username, $scope.formData.email, $scope.formData.password)
        .then(function (response) {
          swal("Success!", response.data.message, "success");
        })
        .catch(function (error) {
          swal("Error!", error.data.message || "An unknown error occurred", "error");
        });
    };
  },
]);
