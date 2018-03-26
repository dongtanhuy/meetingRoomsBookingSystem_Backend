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

describe('Create new meeting room', () => {
  before((done) => {
    Room.remove({}, err => {
      done(err)
    })
  })

  after((done) => {
    Room.remove({})
    done()
  })

  it('It should create new room successfully', (done) => {
    let room = {
      name: 'New York Room',
      max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(room)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        res.body.should.have.property('data')
        res.body.data.should.be.an('Object')
        res.body.data.should.have.property('id')
        res.body.data.id.should.be.a('String')
        res.body.data.should.have.property('name')
        res.body.data.name.should.be.eql(room.name)
        res.body.data.should.have.property('max_size')
        res.body.data.max_size.should.be.deep.eql(room.max_size)
        res.body.data.should.have.property('status')
        res.body.data.status.should.be.eql(room.status)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Create new room successfully')
        done()
      })
  })

  it('It should not create new room if user is not admin', (done) => {
    let room = {
      name: 'New York Room',
      max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(room)
      .end((req, res) => {
        res.should.have.status(403)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Permission denied')
        done()
      })
  })

  it('It should not create new room if missing token', (done) => {
    let room = {
      name: 'New York Room',
      max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', null)
      .send(room)
      .end((req, res) => {
        res.should.have.status(401)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Unauthorized')
        done()
      })
  })

  it('It should not create new room if invalid token', (done) => {
    let room = {
      name: 'New York Room',
      max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT afhsdbhs')
      .send(room)
      .end((req, res) => {
        res.should.have.status(500)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Server Error')
        done()
      })
  })

  it('It should not create new room if missing room name', (done) => {
    let room = {
      // name: 'New York Room',
      max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(room)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad request')
        done()
      })
  })

  it('It should not create new room if missing room size', (done) => {
    let room = {
      name: 'New York Room',
      // max_size: 10,
      status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(room)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad request')
        done()
      })
  })

  it('It should not create new room if missing room status', (done) => {
    let room = {
      name: 'New York Room',
      max_size: 10
      // status: true
    }
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
    chai.request(server)
      .post(API)
      .set('token', 'JWT ' + token)
      .send(room)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Bad request')
        done()
      })
  })
})
