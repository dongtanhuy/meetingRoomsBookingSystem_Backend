/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')
const Room = require('../../model/Room')
const should = chai.should()
chai.use(chaiHttp)
const API = '/api/room/'
let User = require('../../model/User')
const jwt = require('jsonwebtoken')
const config = require('config')

describe('Delete room with given id', () => {
  beforeEach(done => {
    Room.remove({}, err => {
      done(err)
    })
  })

  after(done => {
    Room.remove({}, err => {
      done(err)
    })
  })

  it('It should delete a room with give ID', done => {
    let room = new Room({
      name: 'Test delete room',
      max_size: 10,
      status: true
    })

    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': true,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))

    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + room._id)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(200)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(true)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Delete room successfully')
            done()
          })
      }
    })
  })

  it('It should not delete a room if missing token', done => {
    let room = new Room({
      name: 'Test delete room',
      max_size: 10,
      status: true
    })

    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': true,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))

    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + room._id)
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

  it('It should return 404 if room not found', done => {
    let room = new Room({
      name: 'Test room1',
      max_size: 10,
      status: true
    })
    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': true,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + room._id + 'hsdksfj')
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(404)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room not found')
            done()
          })
      }
    })
  })

  it('It should return 404 if id not found in url', done => {
    let room = new Room({
      name: 'Test room1',
      max_size: 10,
      status: true
    })
    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': true,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
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

  it('It should return 403 if user is not admin', done => {
    let room = new Room({
      name: 'Test room1',
      max_size: 10,
      status: true
    })
    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': false,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + room._id)
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

  it('It should return 500 if cannot verify token', done => {
    let room = new Room({
      name: 'Test room1',
      max_size: 10,
      status: true
    })
    let user = {
      '_id': '5aaa02baf0fb4e0632f88c4c',
      'email': 'huy.dong@gcalls.co',
      'fullname': 'Julian Dong',
      'password': '$2a$10$xlhvV0CjUkA.1UiE8emZreG5NTH5JbfnDFFZP2AdbEdbBbB2kByq6',
      'status': true,
      'isAdmin': true,
      '__v': 0
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .delete(API + room._id)
          .set('token', 'JWT kzndsfn' + token)
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
