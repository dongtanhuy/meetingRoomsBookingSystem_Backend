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

module.exports = editRoom
