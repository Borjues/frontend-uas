angular.module("outfitologyApp").controller("LoginController", [
  "$scope",
  "AuthService",
  "$location",
  function ($scope, AuthService, $location) {
    $scope.formData = {
      username: "",
      password: "",
    };

    $scope.login = function () {
      if ($scope.formData.username && $scope.formData.password) {
        AuthService.login($scope.formData.username, $scope.formData.password)
          .then(function (response) {
            swal("Success!", "Login successful.", "success").then(function () {
              $location.path("/homepage");
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
]);
