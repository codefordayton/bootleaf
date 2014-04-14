layerGroup = function(config) {
  this.layers = [];
  this.init(config);
}

layerGroup.prototype = {
  constructor: layerGroup,
  init: function(config) {
    if (config) {
      for (prop in config) {
        this[prop] = config[prop];
      }
    }
  },
  // adds a layer into this array
  add: function(layer) {
      this.layers.push(layer);
  }


};
