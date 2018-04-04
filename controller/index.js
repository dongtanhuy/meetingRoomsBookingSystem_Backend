// import more controller here
let login = require('./auth/login')
let register = require('./auth/register')
let forgetPassword = require('./auth/forgetPassword')
let resetPassword = require('./auth/resetPassword')
let createNewRoom = require('./room/createNewRoom')
let getRooms = require('./room/getRooms')
let getRoom = require('./room/getRoom')
let editRoom = require('./room/editRoom')
let deleteRoom = require('./room/deleteRoom')

let createBooking = require('./booking/createBooking')
let getAllBookings = require('./booking/getAllBookings')
let getBooking = require('./booking/getBooking')
let deleteBooking = require('./booking/deleteBooking')
let editBooking = require('./booking/editBooking')
module.exports = {
  login: login,
  register: register,
  forgetpassword: forgetPassword,
  resetpassword: resetPassword,
  createbooking: createBooking,
  getAllBookings: getAllBookings,
  getBooking: getBooking,
  deleteBooking: deleteBooking,
  addNewRoom: createNewRoom,
  getAllRooms: getRooms,
  getRoom: getRoom,
  editRoom: editRoom,
  deleteRoom: deleteRoom,
  editBooking: editBooking
  // export to route
}
