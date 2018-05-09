(function() {
  var staticURL = "https://timezoneapi.io/api/address/?";
  var cities = ["Chicago", "Kanigiri", "Dubai", "Oman", "Singapore", "Seattle"];
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

  function updateTime() {
    var elements = document.querySelectorAll(".time-list");
    elements.forEach(ele => {
      var offset = ele.getAttribute("data-offset");
      var date = dateTime.getOffSetTime(offset);
      var city = ele.getAttribute("data-city");
      var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      console.log("city", city, "date", time);
    });
  }

  function setUpTimer() {
    setInterval(updateTime, 1000);
  }

  function generateTimeNode(obj, length) {
    var background = app.getRandomColor();
    var height = app.nodeHeight(length);
    var style = `background-color:${background};height:${height}`;
    var list = `<li class="time-list" data-city=${obj.address} data-offset=${
      obj.offset
    } style=${style}>
            <div id=${obj.geoid} class="time-city">
                <div class="city">${obj.address}</div>
                <div class="time">${obj.time}</div>
            </div>
        </li>`;
    return list;
  }

  function processResponse(result, length) {
    // var result = JSON.parse(response);
    if (result.meta.code === "200") {
      var address = result.data.addresses[0];
      var obj = {
        geoid: address.timezone.geoname_id,
        address: address.formatted_address,
        timezone: address.datetime.offset_tzab,
        offset: address.datetime.offset_minutes,
        time: address.datetime.time
      };
      var node = generateTimeNode(obj, length);
      times.insertAdjacentHTML("beforeend", node);
    }
  }

  function startUp() {
    storage.clear();
    if (!storage.hasData()) {
      console.log("Local storage has no data");
      var promises = Promise.all(addressList);
      promises
        .then(function(results) {
          storage.set(app.appName(), JSON.stringify(results));
          var length = results.length;
          results.map(res => processResponse(JSON.parse(res), length));
        })
        .then(function() {
          setUpTimer();
        });
    } else {
      console.log("Local storage has data");
      var localData = storage.get(app.appName());
      var jsonData = JSON.parse(localData);
      var length = jsonData.length;
      jsonData.map(res => processResponse(JSON.parse(res), length));
      setUpTimer();
    }
  }
  startUp();
})();
