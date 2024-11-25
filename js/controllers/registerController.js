angular.module("outfitologyApp").controller("RegisterController", [
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
          });
        })
        .catch(function (error) {
          swal("Error!", error.data.message || "An unknown error occurred", "error");
        });
    };
  },
]);
