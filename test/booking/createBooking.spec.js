/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')
const Room = require('../../model/Room')
const should = chai.should()
chai.use(chaiHttp)
const API = '/api/bookings/'
let User = require('../../model/User')
const Booking = require('../../model/BookingSession')
const jwt = require('jsonwebtoken')
const config = require('config')
describe('Booking new session', () => {
  let roomID = ''
  let userID = ''
  let token = ''
  before((done) => {
    Room.remove({})
    Booking.remove({})
    User.remove({})
    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      '__v': 0
    }
    let newRoom = {
      '_id': '5ab50e4018181c17b8fa1295',
      'name': 'Test room',
      'max_size': 15,
      'status': true,
      '__v': 0
    }
    roomID = newRoom._id
    userID = user._id
    token = jwt.sign(user, config.get('passportSecret'))
    done()
  })

  after((done) => {
    User.remove({})
    Booking.remove({})
    Room.remove({})
    done()
  })

  it('It should create new session without any conflict', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        res.body.should.have.property('data')
        res.body.data.should.be.an('Object')
        res.body.data.should.have.property('title')
        res.body.data.should.have.property('date')
        res.body.data.should.have.property('startAt')
        res.body.data.should.have.property('endAt')
        res.body.data.should.have.property('numberOfParticipants')
        res.body.data.should.have.property('organizer')
        res.body.data.should.have.property('room')
        res.body.data.should.have.property('state')
        done()
      })
  })

  it('It should not create new session if invalid token', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ansdfj' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(500)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Server Error')
        done()
      })
  })

  it('It should not create session if missing token', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', null)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(401)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Unauthorized')
        done()
      })
  })

  it('It should not create session if missing title', (done) => {
    let newSession = {
      // title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing date', (done) => {
    let newSession = {
      title: 'Test session',
      // date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing start time', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      // startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing end time', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      // endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing number of participants', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      // numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing organizer', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      // organizer: userID,
      room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })

  it('It should not create session if missing room ID', (done) => {
    let newSession = {
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID
      // room: roomID
    }
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(newSession)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad Request')
        done()
      })
  })
})
