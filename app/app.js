var app = (function() {
  var staticURL = "https://timezoneapi.io/api/address/?";
  var cities = ["Chicago", "Dubai", "Singapore", "Canada"];
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

  function getProcessedOffset(offset) {
    return offset / 60;
  }

  function updateTime() {
    var elements = document.querySelectorAll(".time-list");
    elements.forEach(ele => {
      var offset = ele.getAttribute("data-offset");
      var city = ele.getAttribute("data-city");
      var timeElement = ele.querySelector("div.time");
      var localOffset = getProcessedOffset(offset);
      console.log(city, localOffset);
      timeElement.innerHTML = moment()
        .utcOffset(localOffset)
        .format("MMMM Do HH:mm:ss");
    });
  }
  function setUpTimer() {
    setInterval(updateTime, 1000);
  }

  function generateTimeNode(obj) {
    var style = `background-color:${obj.background};height:${obj.height}`;
    return `<li class="time-list" data-city=${obj.address} data-offset=${
      obj.offset
    } style=${style}>
            <div id=${obj.geoid} class="time-city">
                <div class="city">${obj.address}</div>
                <div class="time">${obj.time}</div>
            </div>
        </li>`;
  }

  function generateObjectFromResult(result, length, isFromLocalStorage) {
    if (!isFromLocalStorage) {
      if (result.meta.code === "200") {
        var address = result.data.addresses[0];
        return {
          geoid: address.timezone.geoname_id,
          address: address.formatted_address,
          timezone: address.datetime.offset_tzab,
          offset: address.datetime.offset_minutes,
          time: address.datetime.time,
          background: appConstants.getRandomColor(),
          height: appConstants.nodeHeight(length)
        };
      }
    }
    return result;
  }

  function processResponse(result, length, isFromLocalStorage) {
    var obj = generateObjectFromResult(result, length, isFromLocalStorage);
    var node = generateTimeNode(obj);
    times.insertAdjacentHTML("beforeend", node);
    return obj;
  }

  return {
    startUp: function() {
      storage.clear();
      if (!storage.hasData()) {
        var promises = Promise.all(addressList);
        promises
          .then(function(results) {
            var length = results.length;
            var processedResults = results.map(res =>
              processResponse(JSON.parse(res), length, false)
            );
            storage.set(
              appConstants.appName(),
              JSON.stringify(processedResults)
            );
          })
          .then(function() {
            setUpTimer();
          });
      } else {
        var localData = storage.get(appConstants.appName());
        var jsonData = JSON.parse(localData);
        var length = jsonData.length;
        jsonData.map(res => processResponse(res, length, true));
        setUpTimer();
      }
    }
  };
})();
