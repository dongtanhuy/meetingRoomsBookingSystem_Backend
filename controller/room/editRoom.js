const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Room = require('../../model/Room')

let editRoom = (req, res) => {
  let updatedData = {
    name: req.body.name,
    max_size: req.body.max_size,
    status: req.body.status
  }
  let id = req.params.id
  let token = utils.getTokenFromHeaders(req.headers)
  if (!token) {
    // Handle 401
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
    })
  } else if (req.body.name === '' || req.body.max_size === 0) {
    // Handle 400
    res.status(400)
    res.json({
      success: false,
      message: 'Bad request'
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
          Room.findByIdAndUpdate(id, updatedData, (err, result) => {
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
                data: result,
                message: 'Room information updated'
              })
            }
          })
        }
      }
    })
  }
}

module.exports = editRoom
