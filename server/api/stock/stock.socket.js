/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var stock = require('./stock.model');

exports.register = function(socket) {
  stock.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  stock.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('stock:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('stock:remove', doc);
}
