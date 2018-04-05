const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Booking = require('./../../model/BookingSession')

let editBooking = (req, res) => {
  let id = req.params.id
  let token = utils.getTokenFromHeaders(req.headers)
  let updatedData = {
    title: req.body.title,
    date: req.body.date,
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    numberOfParticipants: req.body.numberOfParticipants,
    room: req.body.room

  }
  if (!token) {
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
    })
  } else if (!updatedData.title ||
              !updatedData.date ||
              !updatedData.startAt ||
              !updatedData.endAt ||
              !updatedData.numberOfParticipants ||
              !updatedData.room) {
    res.status(400)
    res.json({
      success: false,
      message: 'Bad Request'
    })
  } else {
    jwt.verify(token, config.get('passportSecret'), (err, result) => {
      if (err) {
        // Handle 500
        if (err.name === 'JsonWebTokenError') {
          res.status(500)
          res.json({
            success: false,
            message: 'Server Error'
          })
        }
        // Handle 400
        if (err.name === 'TokenExpiredError') {
          res.status(400)
          res.json({
            success: false,
            message: 'Your token is invalid or expired'
          })
        }
      } else {
        Booking.findByIdAndUpdate(id, updatedData, (err, result) => {
          if (err) {
            res.status(404)
            res.json({
              success: false,
              message: 'Bookings not found'
            })
          } else {
            let currentUser = result._id
            if (currentUser.toString !== result.organizer.toString()) {
              res.status(403)
              res.json({
                success: false,
                message: 'Permission denied'
              })
            }
          }
        })
      }
    })
  }
}

module.exports = editBooking
