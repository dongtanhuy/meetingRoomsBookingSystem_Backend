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
  beforeEach((done) => {
    Booking.remove({}, err => {
      done(err)
    })
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
  })

  afterEach((done) => {
    Booking.remove({}, err => {
      done(err)
    })
  })
  it('It should create new session without any conflict', (done) => {
    let d = new Date('April 3, 2018 09:00:00')
    let s1 = new Date('April 3, 2018 09:00:00')
    let e1 = new Date('April 3, 2018 10:00:00')
    let s = new Date('April 3, 2018 10:30:00')
    let e = new Date('April 3, 2018 12:00:00')
    let newSession = {
      title: 'Test session',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    let currentSession = new Booking({
      title: 'Test session current',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    currentSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
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
            res.body.data.should.have.property('status')
            done()
          })
      }
    })
  })

  it('It should return 409 if session overlap S < S1 < E', done => {
    let d = new Date('April 3, 2018 09:00:00')
    let s1 = new Date('April 3, 2018 09:00:00')
    let e1 = new Date('April 3, 2018 10:00:00')

    let s = new Date('April 3, 2018 08:30:00')
    let e = new Date('April 3, 2018 09:30:00')
    let newSession = {
      title: 'Test session',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    let currentSession = new Booking({
      title: 'Test session current',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    currentSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .post(API)
          .set('token', 'JWT ' + token)
          .send(newSession)
          .end((req, res) => {
            res.should.have.status(409)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room not available')
            done()
          })
      }
    })
  })

  it('It should return 409 if session overlap S < E1 < E', done => {
    let d = new Date('April 3, 2018 09:00:00')
    let s1 = new Date('April 3, 2018 09:00:00')
    let e1 = new Date('April 3, 2018 10:00:00')

    let s = new Date('April 3, 2018 9:30:00')
    let e = new Date('April 3, 2018 12:00:00')
    let newSession = {
      title: 'Test session',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    let currentSession = new Booking({
      title: 'Test session current',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    currentSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .post(API)
          .set('token', 'JWT ' + token)
          .send(newSession)
          .end((req, res) => {
            res.should.have.status(409)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room not available')
            done()
          })
      }
    })
  })

  it('It should return 409 if session overlap S < S1 < E1 < E', done => {
    let d = new Date('April 3, 2018 09:00:00')
    let s1 = new Date('April 3, 2018 09:00:00')
    let e1 = new Date('April 3, 2018 10:00:00')

    let s = new Date('April 3, 2018 8:30:00')
    let e = new Date('April 3, 2018 12:00:00')
    let newSession = {
      title: 'Test session',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    let currentSession = new Booking({
      title: 'Test session current',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    currentSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .post(API)
          .set('token', 'JWT ' + token)
          .send(newSession)
          .end((req, res) => {
            res.should.have.status(409)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room not available')
            done()
          })
      }
    })
  })

  it('It should return 409 if session overlap S1 < S < E < E1', done => {
    let d = new Date('April 3, 2018 09:00:00')
    let s1 = new Date('April 3, 2018 09:00:00')
    let e1 = new Date('April 3, 2018 11:00:00')

    let s = new Date('April 3, 2018 9:30:00')
    let e = new Date('April 3, 2018 10:00:00')
    let newSession = {
      title: 'Test session',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    }
    let currentSession = new Booking({
      title: 'Test session current',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    currentSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .post(API)
          .set('token', 'JWT ' + token)
          .send(newSession)
          .end((req, res) => {
            res.should.have.status(409)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room not available')
            done()
          })
      }
    })
  })
})
