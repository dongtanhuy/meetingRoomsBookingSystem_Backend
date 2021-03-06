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

describe('Update room with specific id', () => {
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

  it('It should update info of room with given id', done => {
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(200)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(true)
            res.body.should.have.property('data')
            res.body.data.should.be.an('Object')
            res.body.data.should.have.property('_id')
            res.body.data._id.should.be.eql(room._id.toString())
            res.body.data.should.have.property('name')
            res.body.data.name.should.be.eql(room.name)
            res.body.data.should.have.property('max_size')
            res.body.data.max_size.should.be.eql(room.max_size)
            res.body.data.should.have.property('status')
            res.body.data.status.should.be.eql(room.status)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Room information updated')
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id + 'afjjfa')
          .set('token', 'JWT ' + token)
          .send(updatedData)
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    room.save((err, room) => {
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

  it('It should return 401 if missing token', done => {
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
          // .set('token', 'JWT ' + token)
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

  it('It should not update room if user is not admin', (done) => {
    let room = new Room({
      name: 'New York Room',
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
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

  it('It should return 500 if it cannot verify token', (done) => {
    let room = new Room({
      name: 'New York Room',
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 15,
      status: false
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
          .set('token', 'JWT sdjjf' + token)
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

  it('It should return 400 BAD REQUEST if missing name of room', (done) => {
    let room = new Room({
      name: 'New York Room',
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
    let updatedData = {
      name: '',
      max_size: 15,
      status: false
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad request')
            done()
          })
      }
    })
  })

  it('It should return 400 BAD REQUEST if missing size of room', (done) => {
    let room = new Room({
      name: 'New York Room',
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
    let updatedData = {
      name: 'Test room1 updated',
      max_size: 0,
      status: false
    }
    let token = jwt.sign(user, config.get('passportSecret'))
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .put(API + room._id)
          .set('token', 'JWT ' + token)
          .send(updatedData)
          .end((req, res) => {
            res.should.have.status(400)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Bad request')
            done()
          })
      }
    })
  })
})
