'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoomOnlineLogSchema = new Schema({
    room: String,
    clients: [ Object ],
    clientsNum: Number,
    date: Date,
  }, { timestamps: true });

  return mongoose.model('RoomOnlineLog', RoomOnlineLogSchema, 'center_room_online_log');
};

