angular.module("outfitologyApp").service("AuthService", [
  "$http",
  function ($http) {
    this.login = function (username, password) {
      return $http.post("http://localhost:4000/login", {
        username: username,
        password: password,
      });
    };

    this.register = function (username, email, password) {
      return $http.post("http://localhost:4000/register", {
        username: username,
        email: email,
        password: password,
      });
    };
  },
]);
