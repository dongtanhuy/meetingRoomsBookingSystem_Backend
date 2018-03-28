/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')
const Room = require('../../model/Room')
const should = chai.should()
chai.use(chaiHttp)
const API = '/api/rooms/'
let User = require('../../model/User')
const jwt = require('jsonwebtoken')
const config = require('config')

describe('Get all rooms', () => {
  before((done) => {
    Room.remove({})
    let room1 = new Room({
      name: 'Room1',
      max_size: 10,
      status: true
    })
    let room2 = new Room({
      name: 'Room2',
      max_size: 5,
      status: true
    })
    let room3 = new Room({
      name: 'Room3',
      max_size: 10,
      status: false
    })

    room1.save()
    room2.save()
    room3.save()
    done()
  })

  after((done) => {
    Room.remove({})
    done()
  })

  it('It should return list of all rooms', (done) => {
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
      .get(API)
      .set('token', 'JWT ' + token)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        res.body.should.have.property('data')
        res.body.data.should.be.an('Array')
        res.body.data[0].should.all.be.an('Object')
        res.body.data.length.should.be.eql(3)
        res.body.data[0]._id.should.be.a('String')
        res.body.data[0].name.should.be.a('String')
        res.body.data[0].max_size.should.be.a('Number')
        res.body.data[0].status.should.be.a('Boolean')
        done()
      })
  })

  it('It should not return any thing if missing token', done => {
    chai.request(server)
      .get(API)
      // .set('token', 'JWT ' + )
      .end((req, res) => {
        res.should.have.status(401)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Unauthorized')
        done()
      })
  })

  it('It should not return any thing if invalid token', done => {
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
      .get(API)
      .set('token', 'JWT asffs' + token)
      .end((req, res) => {
        res.should.have.status(500)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Server Error')
        done()
      })
  })

  it('It should return 404 error if no rooms created', done => {
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
    Room.remove({}, err => {
      if (err) {
        console.log(err)
      } else {
        chai.request(server)
          .get(API)
          .set('token', 'JWT ' + token)
          .end((req, res) => {
            res.should.have.status(404)
            res.body.should.have.property('success')
            res.body.success.should.be.eql(false)
            res.body.should.have.property('message')
            res.body.message.should.be.eql('Meeting rooms not found')
            done()
          })
      }
    })
  })
})
