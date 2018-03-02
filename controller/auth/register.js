const User = require('../../model/User')

const register = (req, res) => {
  if (!req.body.email || !req.body.fullName || !req.body.password) {
    res.status(400)
    res.json({success: false, message: 'Missing required fields!'})
  } else {
    let newUser = new User({
      email: req.body.email,
      fullname: req.body.fullName,
      password: req.body.password
    })
    newUser.save(function (err) {
      if (err) {
        // console.log(err)
        res.status(409)
        res.json({success: false, message: 'Email is taken, please enter other email address!'})
      } else {
        res.status(200)
        res.json({success: true, message: 'Create account successfully!'})
      }
    })
  }
}
module.exports = register
