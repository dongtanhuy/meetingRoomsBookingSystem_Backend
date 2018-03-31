const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Room = require('../../model/Room')

let deleteRoom = (req, res) => {
  let id = req.params.id
  let token = utils.getTokenFromHeaders(req.headers)
  if (!token) {
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
        if (!result.isAdmin) {
          res.status(403)
          res.json({
            success: false,
            message: 'Permission denied'
          })
        } else {
          Room.remove({_id: id}, (err) => {
            if (err) {
              // handle 404
              res.status(404)
              res.json({
                success: false,
                message: 'Room not found'
              })
            } else {
              res.status(200)
              res.json({
                success: true,
                message: 'Delete room successfully'
              })
            }
          })
        }
      }
    })
  }
}

module.exports = deleteRoom
