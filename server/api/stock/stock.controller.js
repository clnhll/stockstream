/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /stocks              ->  index
 * POST    /stocks              ->  create
 * GET     /stocks/:id          ->  show
 * PUT     /stocks/:id          ->  update
 * DELETE  /stocks/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');

// Get list of stocks
exports.index = function(req, res) {
  Stock.find(function (err, stocks) {
    if(err) { return handleError(res, err); }
    return res.json(200, stocks);
  });
};

// Get a single stock
exports.show = function(req, res) {
  Stock.findById(req.params.id, function (err, stock) {
    if(err) { return handleError(res, err); }
    if(!stock) { return res.send(404); }
    return res.json(stock);
  });
};

// Creates a new stock in the DB.
exports.create = function(req, res) {
  Stock.create(req.body, function(err, stock) {
    if(err) { return handleError(res, err); }
    return res.json(201, stock);
  });
};

// Updates an existing stock in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Stock.findById(req.params.id, function (err, stock) {
    if (err) { return handleError(res, err); }
    if(!stock) { return res.send(404); }
    var updated = _.merge(stock, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, stock);
    });
  });
};

// Deletes a stock from the DB.
exports.destroy = function(req, res) {
  Stock.findById(req.params.id, function (err, stock) {
    if(err) { return handleError(res, err); }
    if(!stock) { return res.send(404); }
    stock.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
