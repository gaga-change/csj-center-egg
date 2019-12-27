'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoomVersionLogSchema = new Schema({
    room: { type: String, queue: true },
    version: String,
    date: Date,
  }, { timestamps: true });

  return mongoose.model('RoomVersionLog', RoomVersionLogSchema, 'center_room_version_log');
};

