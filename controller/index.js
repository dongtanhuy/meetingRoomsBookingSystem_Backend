// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')
let forgetPassword = require('./auth/forgetPassword')
let resetPassword = require('./auth/resetPassword')
let createNewRoom = require('./room/createNewRoom')
let getRooms = require('./room/getRooms')
let getRoom = require('./room/getRoom')
let editRoom = require('./room/editRoom')

let createBooking = require('./booking/createBooking')
module.exports = {
  login: login,
  register: register,
  forgetpassword: forgetPassword,
  resetpassword: resetPassword,
  createbooking: createBooking,
  addNewRoom: createNewRoom,
  getAllRooms: getRooms,
  getRoom: getRoom,
  editRoom: editRoom
  // export to route
}
