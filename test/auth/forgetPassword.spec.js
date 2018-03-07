/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')

const jwt = require('jsonwebtoken')
const config = require('config')
const should = chai.should()
const expect = chai.expect
let User = require('../../model/User')
chai.use(chaiHttp)
const API = '/api/auth/forgetpassword'

describe('Forget Password', () => {
  before((done) => {
    let newUser = new User({
      email: 'testlogin@gmail.com',
      fullname: 'Julian Dong',
      password: 'testlogin',
      status: true
    })
    newUser.save((err) => {
      if (err) {
        done(err)
      } else {
        console.log('User created')
        done()
      }
    })
  })
  after((done) => {
    User.remove({}, (err) => {
      done(err)
    })
  })

  it('It should return true when request to forget password successfully ', (done) => {
    chai.request(server)
      .post(API)
      .send({email: 'testlogin@gmail.com'})
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        done()
      })
  })

  it('It should return 404 Not Found when email was not register', (done) => {
    chai.request(server)
      .post(API)
      .send({email: 'testlogin1@gmail.com'})
      .end((req, res) => {
        res.should.have.status(404)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Email does not exist')
        done()
      })
  })

  it('It should return 400 Bad Request when missing email', (done) => {
    chai.request(server)
      .post(API)
      .send({email: ''})
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Missing required fields')
        done()
      })
  })
})
