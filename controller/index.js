// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')
let forgetPassword = require('./auth/forgetPassword')

module.exports = {
  login: login,
  register: register,
  forgetpassword: forgetPassword
  // export to route
}
