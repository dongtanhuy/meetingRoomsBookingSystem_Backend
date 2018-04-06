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
    Booking.remove((err) => {
      done(err)
    })
  })

  after(done => {
    Booking.remove((err) => {
      done(err)
    })
  })

  it('It should return 401 if missing token', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      organizer: userID,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .send(updatedData)
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

  it('It should return 404 if session not found', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id + 'sakfadhhfad')
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(404)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bookings not found')
            done()
          })
      }
    })
  })

  it('It should return 404 if missing id on URL', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(404)
            done()
          })
      }
    })
  })

  it('It should return 403 if current user is not organizer', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: '5aaa02baf0fb4e0632f88aac',
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
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

  it('It should return 500 if invalid token', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT sdgsgf' + token)
          .send(updatedData)
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

  it('It should return 400 if missing title', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      // title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })

  it('It should return 400 if missing date', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      // date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })

  it('It should return 400 if missing start time', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      // startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })

  it('It should return 400 if missing end time', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      // endAt: new Date() + 172800,
      numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })

  it('It should return 400 if missing number of Participants', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      // numberOfParticipants: 8,
      room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })

  it('It should return 400 if missing room id', done => {
    let newSession = new Booking({
      title: 'Test session',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 86400,
      numberOfParticipants: 10,
      organizer: userID,
      room: roomID
    })
    let updatedData = {
      title: 'Test session update',
      date: new Date(),
      startAt: new Date(),
      endAt: new Date() + 172800,
      numberOfParticipants: 8
      // room: newRoom1._id
    }

    newSession.save((err, session) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + session._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad Request')
            done()
          })
      }
    })
  })
})
