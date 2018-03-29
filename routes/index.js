const routes = require('express').Router()
const controller = require('../controller')

const LOGIN = '/auth/login'
const REGISTER = '/auth/register'
const FORGET_PASSWORD = '/auth/forgetpassword'
const RESET_PASSWORD = '/auth/resetpassword'
const CREATE_BOOKING = '/bookings'
const ROOM = '/room'
const ROOM_HAVE_ID = '/room/:id'
const ROOMS = '/rooms'
// Add more route here
routes.post(LOGIN, controller.login)
routes.post(REGISTER, controller.register)
routes.post(FORGET_PASSWORD, controller.forgetpassword)
routes.post(RESET_PASSWORD, controller.resetpassword)
routes.post(CREATE_BOOKING, controller.createbooking)
routes.post(ROOM, controller.addNewRoom)
routes.get(ROOMS, controller.getAllRooms)
routes.get(ROOM_HAVE_ID, controller.getRoom)
routes.put(ROOM_HAVE_ID, controller.editRoom)

module.exports = routes
