var dateTime = (function() {
  return {
    getUTC: function() {
      var date = new Date();
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      );
    },
    getOffSetTime: function(offset) {
      var date = new Date();
      var hours = offset / 60;
      var minutes = offset % 60;
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours() + hours,
          date.getMinutes() + minutes,
          date.getSeconds()
        )
      );
    }
  };
})();
