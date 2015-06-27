'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
  name: String,
  type: String,
  data: Array,
  marker: Object,
  color: String,
  active: Boolean
});

module.exports = mongoose.model('Stock', StockSchema);
