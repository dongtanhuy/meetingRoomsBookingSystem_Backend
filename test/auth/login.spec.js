/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')

const should = chai.should()
const expect = chai.expect
let User = require('../../model/User')
chai.use(chaiHttp)
const API = '/api/auth/login'
describe('Login', () => {
  before((done) => { // Before each test we empty the database
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

  it('It should log in successful when input valid cridentials', (done) => {
    let cridentials = {
      email: 'testlogin@gmail.com',
      password: 'testlogin'
    }
    chai.request(server)
      .post(API)
      .send(cridentials)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(true)
        res.body.should.have.property('auth')
        res.body.auth.should.be.eql(true)
        res.body.should.have.property('token')
        res.body.token.should.be.a('string')
        done()
      })
  })

  it('It should not log in if missing password', (done) => {
    let cridentials = {
      email: 'testlogin@gmail.com'
    }
    chai.request(server)
      .post(API)
      .send(cridentials)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('auth')
        res.body.auth.should.be.eql(false)
        res.body.should.have.property('message')
        expect(res.body.token, 'Missing Email or Password')
        done()
      })
  })

  it('It should not log in if missing email', (done) => {
    let cridentials = {
      password: 'testlogin'
    }
    chai.request(server)
      .post(API)
      .send(cridentials)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('auth')
        res.body.auth.should.be.eql(false)
        res.body.should.have.property('message')
        expect(res.body.token, 'Missing Email or Password')
        done()
      })
  })

  it('It should not log in if cannot find Email', (done) => {
    let cridentials = {
      email: 'test1login@gmail.com',
      password: 'testlogin'
    }
    chai.request(server)
      .post(API)
      .send(cridentials)
      .end((req, res) => {
        res.should.have.status(404)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('auth')
        res.body.auth.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('User not found')
        done()
      })
  })

  it('It should not log in if password not matched', (done) => {
    let cridentials = {
      email: 'testlogin@gmail.com',
      password: 'testlogin1'
    }
    chai.request(server)
      .post(API)
      .send(cridentials)
      .end((req, res) => {
        res.should.have.status(401)
        res.body.should.have.property('success')
        res.body.success.should.be.eql(false)
        res.body.should.have.property('auth')
        res.body.auth.should.be.eql(false)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Unauthorized')
        done()
      })
  })
})
