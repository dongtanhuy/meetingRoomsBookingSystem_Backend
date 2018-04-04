/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')
const Room = require('../../model/Room')
const should = chai.should()
chai.use(chaiHttp)
const API = '/api/booking/'
const Booking = require('../../model/BookingSession')
let User = require('../../model/User')
const jwt = require('jsonwebtoken')
const config = require('config')

describe('Get specific booking session with given id', () => {
  let user = {
    '_id': '5aaa02baf0fb4e0632f88c4c',
    'email': 'huy.dong@gcalls.co',
    'fullname': 'Julian Dong',
    'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
    'status': true,
    'isAdmin': true,
    '__v': 0
  }
  let newRoom = {
    '_id': '5ab50e4018181c17b8fa1295',
    'name': 'Test room',
    'max_size': 15,
    'status': true,
    '__v': 0
  }
  let roomID = newRoom._id
  let userID = user._id

  beforeEach(done => {
    Booking.remove((err) => {
      done(err)
    })
  })

  after(done => {
    Booking.remove((err) => {
      done(err)
    })
  })
})
