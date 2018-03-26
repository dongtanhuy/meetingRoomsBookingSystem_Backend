const utils = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const config = require('config')
const Room = require('../../model/Room')
let createNewRoom = (req, res) => {
  let token = utils.getTokenFromHeaders(req.headers)
  if (!token) {
    // Handle 401
    res.status(401)
    res.json({
      success: false,
      message: 'Unauthorized'
    })
  } else if (!req.body.name || !req.body.max_size || !req.body.status) {
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
          // Handle 403 forbiden
          res.status(403)
          res.json({
            success: false,
            message: 'Permission denied'
          })
        } else {
          let newRoom = new Room({
            name: req.body.name,
            max_size: req.body.max_size,
            status: req.body.status
          })
          newRoom.save((err, room) => {
            console.log(err)
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
                data: {
                  id: room._id,
                  name: room.name,
                  max_size: room.max_size,
                  status: room.status
                },
                message: 'Create new room successfully'
              })
            }
          })
        }
      }
    })
  }
}
module.exports = createNewRoom
