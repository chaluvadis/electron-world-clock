(function() {
  var staticURL = "https://timezoneapi.io/api/address/?";
  var cities = ["Chicago", "Kanigiri", "Dubai", "Oman"];
  var addressList = cities.map(data => get(staticURL + data));

  var times = document.getElementById("times");

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

  function processResponse(response) {
    var result = JSON.parse(response);
    if (result.meta.code === "200") {
      var address = result.data.addresses[0];
      console.log(address);
      var list = `<li class="time-list">
            <div class="time-city">
                <div class="city">${address.formatted_address}</div>
                <div class="state">${address.country}</div>
                <div class="timezone">${address.datetime.offset_tzab}</div>
                <div class="time">${address.datetime.time}</div>
            </div>
        </li>`;
      times.insertAdjacentHTML("beforeend", list);
    }
  }

  function startUp() {
    var promises = Promise.all(addressList);
    promises.then(function(results) {
      results.map(res => processResponse(res));
    });
  }
  startUp();
})();
