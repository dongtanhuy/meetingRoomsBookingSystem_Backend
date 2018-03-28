// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')
let forgetPassword = require('./auth/forgetPassword')
let resetPassword = require('./auth/resetPassword')
let createNewRoom = require('./room/createNewRoom')
let getRooms = require('./room/getRooms')

let createBooking = require('./booking/createBooking')
module.exports = {
  login: login,
  register: register,
  forgetpassword: forgetPassword,
  resetpassword: resetPassword,
  createbooking: createBooking,
  addNewRoom: createNewRoom,
  getAllRooms: getRooms
  // export to route
}
