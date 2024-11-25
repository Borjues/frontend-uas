angular.module("outfitologyApp").controller("LoginController", [
  "$scope",
  "AuthService",
  "$location",
  function ($scope, AuthService, $location) {
    var vm = this;

    vm.user = {
      username: "",
      password: "",
    };

    vm.submitForm = function () {
      if (vm.user.username && vm.user.password) {
        AuthService.login(vm.user.username, vm.user.password)
          .then(function (response) {
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
]);
