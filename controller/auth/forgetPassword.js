const User = require('../../model/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const nodemailer = require('nodemailer')

let forgetPassword = (req, res) => {
  if (!req.body.email) {
    // handle 400 Bad Request
    res.status(400)
    res.json({
      success: false,
      message: 'Missing required fields'
    })
  }
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      // handle 500 Server Error
      res.status(500)
      res.json({
        success: false,
        message: 'Server Error'
      })
    }
    if (!user) {
      // handle 404 not found
      res.status(404)
      res.json({
        success: false,
        message: 'Email does not exist'
      })
    } else {
      // handle 200
      let token = jwt.sign(user.toJSON(), config.get('passportSecret'))
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          clientId: process.env.Gmail_CLIENT_ID,
          clientSecret: process.env.Gmail_CLIENT_SECRET
        }
      })
      const mailOptions = (token, email) => ({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Reset password',
        generateTextFromHTML: true,
        html: `Reset link: <a href="http://localhost:8080/resetPassword?token=${token}">http://localhost:8080/resetPassword?token=${token}</a>`,
        auth: {
          user: process.env.SENDER_EMAIL,
          accessToken: process.env.ACCESS_TOKEN,
          refreshToken: process.env.REFRESH_TOKEN,
          expires: 1484314697598
        }
      })

      transporter.sendMail(mailOptions(token, user.email))
      res.status(200)
      res.json({
        success: true
      })
    }
  })
}

module.exports = forgetPassword
