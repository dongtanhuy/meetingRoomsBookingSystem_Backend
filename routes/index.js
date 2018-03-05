const routes = require('express').Router()
const controller = require('../controller')

const LOGIN = '/auth/login'
const REGISTER = '/auth/register'
// Add more route here
routes.post(LOGIN, controller.login)
routes.post(REGISTER, controller.register)

module.exports = routes
