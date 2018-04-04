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
          // console.log('New: ', session)
          // console.log('Current: ', bookings)
          let s = new Date(session.startAt).getTime()
          let e = new Date(session.endAt).getTime()
          let result = true
          if (err) {
            result = false
          } else {
            if (bookings === null || bookings.length === 0) {
              result = false
            } else {
              for (let item of bookings) {
                let s1 = new Date(item.startAt).getTime()
                let e1 = new Date(item.endAt).getTime()
                // console.log('s:', s)
                // console.log('e:', e)
                // console.log('s1:', s1)
                // console.log('e1:', e1)
                if (e > s1 && s < s1) {
                  console.log('S < S1 < E')
                  result = false
                } else if (s < e1 && e > e1) {
                  console.log('S < E1 < E')
                  result = false
                } else if (s < s1 && e > e1) {
                  console.log('S < S1 && E > E1')
                  result = false
                } else if (s > s1 && e < e1) {
                  console.log('S1 < S < E < E1')
                  result = false
                } else {
                  console.log('OK')
                  result = true
                }
              }
            }
          }
          // console.log(result)
          if (result) {
            // 200
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
        })
      }
    })
  }
}
// const validate = (session) => {
//   Booking.find({date: session.date, room: session.room}, (err, bookings) => {
//     console.log('New: ', session)
//     console.log('Current: ', bookings)
//     let s = new Date(session.startAt).getTime()
//     let e = new Date(session.endAt).getTime()
//     let result = true
//     if (err) {
//       result = false
//     } else {
//       if (bookings === null || bookings.length === 0) {
//         result = true
//       } else {
//         for (let item of bookings) {
//           let s1 = new Date(item.startAt).getTime()
//           let e1 = new Date(item.endAt).getTime()
//           if (e > s1 && s < s1) {
//             console.log('S < S1 < E1')
//             result = false
//           } else if (s < e1 && e > e1) {
//             console.log('S < E1 < E')
//             result = false
//           } else if (s < s1 && e > e1) {
//             console.log('S < S1 && E > E1')
//             result = false
//           } else if (s > s1 && e < e1) {
//             console.log('S1 < S < E < E1')
//             result = false
//           } else {
//             result = true
//           }
//         }
//       }
//     }
//     console.log(result)
//     return result
//   })
// }
module.exports = createBooking
