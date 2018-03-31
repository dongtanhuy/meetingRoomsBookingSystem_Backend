const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Room = require('../../model/Room')

let getRoom = (req, res) => {
  let id = req.params.id
  let token = utils.getTokenFromHeaders(req.headers)
  if (!token) {
    // Handle 401
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
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
        Room.findById(id, (err, room) => {
          if (err) {
            // handle 404
            res.status(404)
            res.json({
              success: false,
              message: 'Room not found'
            })
          } else {
            // console.log(room)
            res.status(200)
            res.json({
              success: true,
              data: room
            })
          }
        })
      }
    })
  }
}
module.exports = getRoom
