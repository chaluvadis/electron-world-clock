var dateTime = (function() {
  return {
    getUTC: function() {
      var date = new Date();
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      );
    },
    getOffSetTime: function (offset) {
      var date = new Date();
      var localOffset = date.getTimezoneOffset();
      date.setMinutes(offset+localOffset);
      return date;
    }
  };
})();
