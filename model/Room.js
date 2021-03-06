const mongoose = require('mongoose')
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  max_size: {
    type: Number,
    required: true
  },
  status: { // TRUE => IN_USE, FALSE => DISABLED
    type: Boolean,
    required: true,
    default: true
  }
})
module.exports = mongoose.model('Room', RoomSchema)
