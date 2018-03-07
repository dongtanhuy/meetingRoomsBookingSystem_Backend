const routes = require('express').Router()
const controller = require('../controller')

const LOGIN = '/auth/login'
const REGISTER = '/auth/register'
const FORGET_PASSWORD = '/auth/forgetpassword'
// Add more route here
routes.post(LOGIN, controller.login)
routes.post(REGISTER, controller.register)
routes.post(FORGET_PASSWORD, controller.forgetpassword)
module.exports = routes
