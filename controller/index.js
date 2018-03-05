// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')

module.exports = {
  login: login,
  register: register
  // export to route
}
