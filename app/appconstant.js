var appConstants = (function() {
  var APP_NAME = "MyClock";
  return {
    appName: function() {
      return APP_NAME;
    },
    getRandomColor: function() {
      return (
        "#" +
        Math.random()
          .toString(16)
          .substr(2, 6)
      );
    },
    nodeHeight: function(length) {
      return `${parseFloat(100 / length)
        .toFixed(1)
        .toString()}vh`;
    }
  };
})();
