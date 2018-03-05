const User = require('../../model/User')
const config = require('config')
const jwt = require('jsonwebtoken')
let login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status('400')
    res.json({
      success: false,
      auth: false,
      message: 'Missing Email or Password'
    })
  }
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      // error when query data
      res.status(500)
      res.json({
        success: false,
        auth: false,
        message: 'Server error'
      })
    }
    if (!user) {
      // user not found
      res.status(404)
      res.json({
        success: false,
        auth: false,
        message: 'User not found'
      })
    } else {
      // check password
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          let token = jwt.sign(user.toJSON(), config.get('passportSecret'))
          res.status(200)
          res.json({
            success: true,
            auth: true,
            token: 'JWT ' + token
          })
        } else {
          res.status(401).json({
            success: false,
            auth: false,
            message: 'Unauthorized'
          })
        }
      })
    }
  })
}

module.exports = login
