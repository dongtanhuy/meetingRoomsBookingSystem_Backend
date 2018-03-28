const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Room = require('../../model/Room')

const getRooms = (req, res) => {
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
        Room.find((err, rooms) => {
          if (err) {
            // handle 500
            res.status(500)
            res.json({
              success: false,
              message: 'Server Error'
            })
          } else {
            if (rooms === null || rooms.length === 0) {
              // handle 404
              res.status(404)
              res.json({
                success: false,
                message: 'Meeting rooms not found'
              })
            } else {
              res.status(200)
              res.json({
                success: true,
                data: rooms
              })
            }
          }
        })
      }
    })
  }
}
module.exports = getRooms
