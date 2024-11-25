angular.module("outfitologyApp").factory("AuthService", [
  "$http",
  "$q",
  function ($http, $q) {
    return {
      login: function (username, password) {
        return $http.post("http://localhost:4000/login", {
          username: username,
          password: password,
        });
      },

      register: function (username, email, password) {
        return $http.post("http://localhost:4000/register", {
          username: username,
          email: email,
          password: password,
        });
      },

      isLoggedIn: function () {
        return !!localStorage.getItem("user");
      },

      checkAuth: function () {
        var deferred = $q.defer();

        if (this.isLoggedIn()) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        return deferred.promise;
      },
    };
  },
]);
