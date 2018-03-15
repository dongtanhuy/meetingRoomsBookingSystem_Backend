/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')

const jwt = require('jsonwebtoken')
const config = require('config')
const should = chai.should()
const expect = chai.expect
const utils = require('../../utils/utils')
let User = require('../../model/User')
chai.use(chaiHttp)
const API = '/api/auth/resetpassword'
const LOGIN_API = '/api/auth/login'

describe('Reset password', () => {
  let token = ''
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
      }
    })
    chai.request(server)
      .post(LOGIN_API)
      .send({
        email: 'testlogin@gmail.com',
        password: 'testlogin'
      })
      .end((req, res) => {
        console.log('User logged in')
        token = utils.extractToken(res.body.token)
        done()
      })
  })
  after((done) => {
    User.remove({}, (err) => {
      done(err)
    })
  })

  it('It should update new password for user', (done) => {
    let data = {
      newPassword: 'newpassword',
      token: token
    }
    chai.request(server)
      .post(API)
      .send(data)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Your password have been updated')
        done()
      })
  })

  it('It should not update new password for user if missing token', (done) => {
    let data = {
      newPassword: 'newpassword',
      token: ''
    }
    chai.request(server)
      .post(API)
      .send(data)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Your token is invalid or expired')
        done()
      })
  })

  it('It should not update new password for user if invalid token', (done) => {
    let data = {
      newPassword: 'newpassword',
      token: token + 'ashsdj'
    }
    chai.request(server)
      .post(API)
      .send(data)
      .end((req, res) => {
        res.should.have.status(500)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Server Error')
        done()
      })
  })
})
