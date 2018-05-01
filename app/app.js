(function() {
  var staticURL = "https://timezoneapi.io/api/address/?";
  var cities = ["Chicago", "Kanigiri", "Dubai", "Oman", "Singapore", "Seattle"];
  var addressList = cities.map(data => get(staticURL + data));
  var times = document.getElementById("times");

  function isOnLine() {
    return navigator.onLine;
  }

  function getRandomColor() {
    return (
      "#" +
      Math.random()
        .toString(16)
        .substr(2, 6)
    );
  }

  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }

  function processResponse(response, length) {
    var result = JSON.parse(response);
    if (result.meta.code === "200") {
      var address = result.data.addresses[0];
      var obj = {
        geoid: address.timezone.geoname_id,
        address: address.formatted_address,
        timezone: address.datetime.offset_tzab,
        offset: address.datetime.offset_minutes
      };
      var background = getRandomColor();
      storage.set(obj.geoid, JSON.stringify(obj));
      var height = `${parseFloat(100 / length).toFixed(1).toString()}vh`; 
      var style = `background-color:${background};height:${height}`;
      var list = `<li class="time-list" style=${style}>
            <div class="time-city">
                <div class="city">${address.formatted_address}</div>
                <div class="time">${address.datetime.time}</div>
            </div>
        </li>`;
      times.insertAdjacentHTML("beforeend", list);
    }
  }

  function startUp() {
    if (isOnLine()) {
      var promises = Promise.all(addressList);
      promises.then(function(results) {
        storage.clear();
        var length = results.length;
        results.map(res => processResponse(res, length));
      });
    } else {
      // load data from localstorage
    }
  }
  startUp();
})();
