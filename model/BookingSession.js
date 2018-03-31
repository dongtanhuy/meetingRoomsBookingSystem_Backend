const mongoose = require('mongoose')
const BookingSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  numberOfParticipants: {
    type: Number,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Room'
  },
  status: {
    type: String,
    required: true,
    options: ['UP_COMING', 'IN_COMING', 'CANCELED'],
    default: 'UP_COMING'
  }
})
module.exports = mongoose.model('BookingSession', BookingSessionSchema)
