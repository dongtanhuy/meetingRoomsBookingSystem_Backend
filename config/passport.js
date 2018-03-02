const JWTStrategy = require('passport-jwt')
const ExtractJWT = require('passport-jwt').ExtractJwt
const config = require('config')

const User = require('../model/User')
var secret = config.get('passportSecret')

module.exports = function (passport) {
  var options = {}
  options.jwtFromRequest = ExtractJWT.fromAuthHeader()
  options.secretOrKey = secret
  passport.use(new JWTStrategy(options, function (jwtPayload, done) {
    User.findOne({id: jwtPayload.id}, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
