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

describe('Get room with specific id', () => {
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

  it('It should return detail of room with specific ID', (done) => {
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
          .get(API + room._id)
          .set('token', 'JWT ' + token)
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
          .get(API + room._id + 'hsdksfj')
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
          .get(API)
          .set('token', 'JWT ' + token)
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
    room.save((err, room) => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API + room._id)
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
          .get(API + room._id)
          .set('token', 'JWT afnk' + token)
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
