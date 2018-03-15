// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')
let forgetPassword = require('./auth/forgetPassword')
let resetPassword = require('./auth/resetPassword')

module.exports = {
  login: login,
  register: register,
  forgetpassword: forgetPassword,
  resetpassword: resetPassword
  // export to route
}
