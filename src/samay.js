var Samay = (function() {
  var latitude;
  var longitude;
  var now;
  var sunrise;
  var sunset;
  var daytime;
  var prahar;
  var fetchCoordinates = function() {
    return new Promise(function(resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(Error("Geolocation is not supported by this browser"));
      }
    });
  };
  var update = function() {
    return new Promise(function(resolve, reject) {
      fetchCoordinates()
        .then(function(geoposition) {
          latitude = geoposition.coords.latitude;
          longitude = geoposition.coords.longitude;
          return fetchTwilight("today");
        })
        .then(function(response) {
          sunrise = new Date(response.results.sunrise);
          sunset = new Date(response.results.sunset);
          now = new Date();
          if (now <= sunrise) {
            return fetchTwilight("yesterday").then(function(response) {
              sunset = new Date(response.results.sunset);
              daytime = false;
            });
          } else if (sunset <= now) {
            return fetchTwilight("tomorrow").then(function(response) {
              sunrise = new Date(response.results.sunrise);
              daytime = false;
            });
          } else {
            daytime = true;
          }
        })
        .then(function() {
          return calculatePrahar();
        })
        .then(function() {});
    });
  };
  var fetchTwilight = function(date) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: "http://api.sunrise-sunset.org/json",
        dataType: "json",
        data: {
          lat: latitude,
          lng: longitude,
          date: date,
          formatted: "0"
        }
      })
        .done(function(json) {
          return resolve(json);
        })
        .fail(function(xhr, status, err) {
          return reject(status + err.message);
        });
    });
  };
  var calculatePrahar = function() {
    return new Promise(function(resolve, reject) {
      if (daytime) {
        prahar = 1 + Math.floor((4 * (now - sunrise)) / (sunset - sunrise));
      } else {
        prahar = 5 + Math.floor((4 * (now - sunset)) / (sunrise - sunset));
      }
    });
  };
  return {
    update: update,
    prahar: function() {
      return prahar;
    },
    // now: function() {
    //   return now;
    // },
    // lat: function() {
    //   return latitude;
    // },
    // lng: function() {
    //   return longitude;
    // },
    // sunrise: function() {
    //   return sunrise;
    // },
    // sunset: function() {
    //   return sunset;
    // },
    // daytime: function() {
    //   return daytime;
    // }
  };
})();
