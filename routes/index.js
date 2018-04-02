const routes = require('express').Router()
const controller = require('../controller')

const LOGIN = '/auth/login'
const REGISTER = '/auth/register'
const FORGET_PASSWORD = '/auth/forgetpassword'
const RESET_PASSWORD = '/auth/resetpassword'
const BOOKING = '/bookings'
const BOOKING_HAVE_ID = '/booking/:id'
const ROOM = '/room'
const ROOM_HAVE_ID = '/room/:id'
const ROOMS = '/rooms'
// Add more route here
routes.post(LOGIN, controller.login)
routes.post(REGISTER, controller.register)
routes.post(FORGET_PASSWORD, controller.forgetpassword)
routes.post(RESET_PASSWORD, controller.resetpassword)
routes.post(BOOKING, controller.createbooking)
routes.get(BOOKING, controller.getAllBookings)
routes.get(BOOKING_HAVE_ID, controller.getBooking)
routes.delete(BOOKING_HAVE_ID, controller.deleteBooking)
routes.post(ROOM, controller.addNewRoom)
routes.get(ROOMS, controller.getAllRooms)
routes.get(ROOM_HAVE_ID, controller.getRoom)
routes.put(ROOM_HAVE_ID, controller.editRoom)
routes.delete(ROOM_HAVE_ID, controller.deleteRoom)

module.exports = routes
