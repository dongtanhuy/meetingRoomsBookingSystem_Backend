const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Booking = require('../../model/BookingSession')
const createBooking = (req, res) => {
  let token = utils.getTokenFromHeaders(req.headers)
  if (!req.body.title || !req.body.date || !req.body.startAt || !req.body.endAt || !req.body.numberOfParticipants || !req.body.organizer || !req.body.room) {
    res.status(400)
    res.json({
      success: false,
      message: 'Bad Request'
    })
  } else if (token === null) {
    // Handle 401
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
    })
  } else {
    // Handle 500
    // Handle 400
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
        let session = new Booking({
          title: req.body.title,
          date: Date.parse(req.body.date),
          startAt: Date.parse(req.body.startAt),
          endAt: Date.parse(req.body.endAt),
          numberOfParticipants: req.body.numberOfParticipants,
          organizer: req.body.organizer,
          room: req.body.room
        })
        // Validate here, handle 409 and 200
        Booking.find({date: session.date, room: session.room}, (err, bookings) => {
          if (err) {
            res.status(500)
            res.json({
              success: false,
              message: 'Server Error'
            })
          } else {
            if (utils.validate(session, bookings)) {
              session.save((err, result) => {
                if (err) {
                  res.status(500)
                  res.json({
                    success: false,
                    message: 'Server Error'
                  })
                } else {
                  console.log(result)
                  res.status(200)
                  res.json({
                    success: true,
                    data: result
                  })
                }
              })
            } else {
            // Handle 409
              res.status(409)
              res.json({
                success: false,
                message: 'Room not available'
              })
            }
          }
        })
      }
    })
  }
}

module.exports = createBooking
