const User = require('../../model/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')

let encryptPassword = (newPassword) => {
  let coded = ''
  let salt = bcrypt.genSalt(10, () => {})
  coded = bcrypt.hashSync(newPassword, salt)
  return coded
}

let resetPassword = (req, res) => {
  let token = req.body.token
  if (!token) {
    res.status(400)
    res.json({
      success: false,
      message: 'Your token is invalid or expired'
    })
  } else {
    let decoded = ''
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
      }
      decoded = result
    })

    console.log(decoded)
    let newpassword = req.body.newpassword
    User.findByIdAndUpdate(decoded._id, {$set: {password: encryptPassword(newpassword)}}, (err, result) => {
      if (err) {
        res.status(400)
        res.json({
          success: false,
          message: 'Your token is invalid or expired'
        })
      } else {
        res.status(200)
        res.json({
          success: true,
          message: 'Your password have been updated'
        })
      }
    })
  }
}
module.exports = resetPassword
