angular.module("outfitologyApp").factory("UnsplashService", [
  "$http",
  function ($http) {
    const UNSPLASH_ACCESS_KEY = "u5l1RpWY84DwihSsWs0KfKWfpW866WDXWkIPX19CMKA";
    const SEARCH_QUERY = "fashion, streetwear, outfit, casual outfit";

    return {
      fetchImages: function () {
        return $http({
          method: "GET",
          url: `https://api.unsplash.com/photos/random`,
          params: {
            count: 30,
            query: SEARCH_QUERY,
            client_id: UNSPLASH_ACCESS_KEY,
          },
        });
      },
    };
  },
]);
