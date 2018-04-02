/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')
const Room = require('../../model/Room')
const should = chai.should()
chai.use(chaiHttp)
const API = '/api/booking/'
let User = require('../../model/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const Booking = require('../../model/BookingSession')

describe('Delete a session with given ID', () => {
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
    Booking.remove(err => {
      done(err)
    })
  })

  after(done => {
    Booking.remove(err => {
      done(err)
    })
  })

  it('It should delete a session with given ID', done => {
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
          .delete(API + session._id)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(200)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(true)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Delete booking successfully')
            done()
          })
      }
    })
  })

  it('It should return 401 if missing token', done => {
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
          .delete(API + session._id)
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

  it('It should return 404 if session not found ', done => {
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
          .delete(API + session._id + 'asfjgbshdfzb')
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

  it('It should return 404 if missing id in URL ', done => {
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
          .delete(API)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(404)
            done()
          })
      }
    })
  })

  it('It should return 403 if current user is not organizer of session ', done => {
    let token = jwt.sign(user, config.get('passportSecret'))
    let session = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: '5aaa02baf0fb4e0632f88abc',
      room: roomID
    })
    session.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + session._id)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(403)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Permission denied')
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
          .delete(API + session._id)
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
