var storage = (function() {
  return {
    get: function(key) {
      return localStorage.getItem(key);
    },
    set: function(key, value) {
      localStorage.setItem(key, value);
    },
    clear: function () {
      console.info('clear local storage');
      localStorage.clear();
    },
    remove: function(item) {
      return localStorage.removeItem(item);
    }
  };
})();
