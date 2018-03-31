const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Booking = require('../../model/BookingSession')

const getAllBookings = (req, res) => {
  let token = utils.getTokenFromHeaders(req.headers)
  if (!token) {
    // handle 401
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
    })
  } else {
    jwt.verify(token, config.get('passportSecret'), (err, result) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          res.status(500)
          res.json({
            success: false,
            message: 'Server Error'
          })
        }
        if (err.name === 'TokenExpiredError') {
          res.status(400)
          res.json({
            success: false,
            message: 'Your token is invalid or expired'
          })
        }
      } else {
        Booking.find({}, (err, bookings) => {
          if (err) {
            // handle 500
          } else {
            console.log(bookings)
            if (bookings === null || bookings.length === 0) {
              // handle 404
              res.status(404)
              res.json({
                success: false,
                message: 'Bookings not found'
              })
            } else {
              res.status(200)
              res.json({
                success: true,
                data: bookings
              })
            }
          }
        })
      }
    })
  }
}
module.exports = getAllBookings
