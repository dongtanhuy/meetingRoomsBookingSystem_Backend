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
    organizer: req.body.organizer,
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
    jwt.verify(token, config.get('passportSecret'), (err, user) => {
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
        Booking.findById(id, (err, booking) => {
          if (err) {
            res.status(404)
            res.json({
              success: false,
              message: 'Bookings not found'
            })
          } else {
            let currentUser = user._id
            if (currentUser.toString() !== booking.organizer.toString()) {
              res.status(403)
              res.json({
                success: false,
                message: 'Permission denied'
              })
            } else {
              console.log(409)
              let updatedObject = new Booking({
                title: req.body.title,
                date: Date.parse(req.body.date),
                startAt: Date.parse(req.body.startAt),
                endAt: Date.parse(req.body.endAt),
                numberOfParticipants: req.body.numberOfParticipants,
                organizer: req.body.organizer,
                room: req.body.room
              })
              console.log('Updated data', updatedData)
              Booking.find({date: updatedData.date, room: updatedData.room}, (err, bookings) => {
                console.log(bookings)
                if (err) {
                  res.status(500)
                  res.json({
                    success: false,
                    message: 'Server Error'
                  })
                } else {
                  // res.json({done: 500})
                  if (utils.validate(updatedObject, bookings)) {
                    Booking.updateOne({_id: id}, updatedData, (err, result) => {
                      if (err) {
                        res.status(500)
                        res.json({
                          success: false,
                          message: 'Server Error'
                        })
                      } else {
                        res.status(200)
                        res.json({
                          success: true,
                          message: 'Update successfully'
                        })
                      }
                    })
                  } else {
                    res.status(409)
                    res.json({
                      success: false,
                      message: 'Room not available'
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  }
}

module.exports = editBooking
