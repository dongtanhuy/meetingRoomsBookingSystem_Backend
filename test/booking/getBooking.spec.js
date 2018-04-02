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

  it('It should return info of a specific session', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API + session._id)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(200)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(true)
            res.body.should.have.property('data')
            res.body.data.should.be.an('Object')
            res.body.data.should.have.property('_id')
            res.body.data._id.should.be.eql(session._id.toString())
            res.body.data.should.have.property('title')
            res.body.data.title.should.be.eql(session.title)
            res.body.data.should.have.property('date')
            // res.body.data.date.should.be.eql(session.date)
            res.body.data.should.have.property('startAt')
            // res.body.data.startAt.should.be.eql(session.startAt)
            res.body.data.should.have.property('endAt')
            // res.body.data.endAt.should.be.eql(session.endAt)
            res.body.data.should.have.property('numberOfParticipants')
            res.body.data.numberOfParticipants.should.be.eql(session.numberOfParticipants)
            res.body.data.should.have.property('organizer')
            res.body.data.organizer.should.be.eql(session.organizer.toString())
            res.body.data.should.have.property('room')
            res.body.data.room.should.be.eql(session.room.toString())
            res.body.data.should.have.property('status')
            res.body.data.status.should.be.eql(session.status)
            done()
          })
      }
    })
  })

  it('It should not return any thing if missing token', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API + session._id)
          // .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(401)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Unauthorized')
            done()
          })
      }
    })
  })

  it('It should not return anything if session not found', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API + session._id + 'asffdhh')
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(404)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Session not found')
            done()
          })
      }
    })
  })

  it('It should not return anything if id not found in URL', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(404)
            done()
          })
      }
    })
  })

  it('It should return 500 Server Error if invalid token', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API + session._id)
          .set('token', 'JWT ashfjsj' + token)
          .end((req, res) => {
            res.should.have.status(500)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Server Error')
            done()
          })
      }
    })
  })
})
