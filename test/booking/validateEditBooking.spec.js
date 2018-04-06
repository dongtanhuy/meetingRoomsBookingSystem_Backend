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
  let d = new Date('April 3, 2018 09:00:00')
  let s1 = new Date('April 3, 2018 09:00:00')
  let e1 = new Date('April 3, 2018 10:00:00')
  let s2 = new Date('April 3, 2018 10:30:00')
  let e2 = new Date('April 3, 2018 11:30:00')
  let sessionID = ''
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
  let newRoom1 = {
    '_id': '5ab50e4018181c17b8fa1292',
    'name': 'Test room',
    'max_size': 15,
    'status': true,
    '__v': 0
  }
  let roomID = newRoom._id
  let userID = user._id
  let token = jwt.sign(user, config.get('passportSecret'))
  beforeEach(done => {
    Booking.remove({})
    let newSession = new Booking({
      title: 'Test session',
      date: d,
      startAt: s1,
      endAt: e1,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        console.log(session)
        sessionID = session._id
        done()
      }
    })
  })

  afterEach(done => {
    Booking.remove((err) => {
      done(err)
    })
  })

  it('It should return 409 if session overlap S < S1 < E', done => {
    let s = new Date('April 3, 2018 08:30:00')
    let e = new Date('April 3, 2018 09:30:00')

    let updatedData = {
      title: 'Test session update',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 8,
      organizer: userID,
      room: roomID
    }
    console.log(sessionID)
    let newSession1 = new Booking({
      title: 'Test session',
      date: d,
      startAt: s2,
      endAt: e2,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession1.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
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
    let s = new Date('April 3, 2018 09:30:00')
    let e = new Date('April 3, 2018 10:15:00')

    let updatedData = {
      title: 'Test session update',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 8,
      organizer: userID,
      room: roomID
    }
    console.log(sessionID)
    let newSession1 = new Booking({
      title: 'Test session',
      date: d,
      startAt: s2,
      endAt: e2,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession1.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
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
    let s = new Date('April 3, 2018 08:30:00')
    let e = new Date('April 3, 2018 10:15:00')

    let updatedData = {
      title: 'Test session update',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 8,
      organizer: userID,
      room: roomID
    }
    console.log(sessionID)
    let newSession1 = new Booking({
      title: 'Test session',
      date: d,
      startAt: s2,
      endAt: e2,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession1.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
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
    let s = new Date('April 3, 2018 09:30:00')
    let e = new Date('April 3, 2018 09:45:00')

    let updatedData = {
      title: 'Test session update',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 8,
      organizer: userID,
      room: roomID
    }
    console.log(sessionID)
    let newSession1 = new Booking({
      title: 'Test session',
      date: d,
      startAt: s2,
      endAt: e2,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession1.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
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

  it('It should update successfull', done => {
    let s = new Date('April 3, 2018 13:30:00')
    let e = new Date('April 3, 2018 14:45:00')

    let updatedData = {
      title: 'Test session update',
      date: d,
      startAt: s,
      endAt: e,
      numberOfParticipants: 8,
      organizer: userID,
      room: roomID
    }
    console.log(sessionID)
    let newSession1 = new Booking({
      title: 'Test session',
      date: d,
      startAt: s2,
      endAt: e2,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    newSession1.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(200)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(true)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Update successfully')
            done()
          })
      }
    })
  })
})
