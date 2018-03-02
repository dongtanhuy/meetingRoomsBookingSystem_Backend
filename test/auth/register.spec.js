/* global it, describe, beforeEach, before, after, afterEach */
/* eslint no-unused-vars: "off" */
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../index')
const should = chai.should()
let User = require('../../model/User')
chai.use(chaiHttp)
const API = '/api/auth/register'

describe('Register', () => {
  before((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      done(err)
    })
  })

  describe('/POST user', () => {
    it('It should create new user', (done) => {
      let newUser = {
        email: 'test@gmail.com',
        fullName: 'Dong Tan Huy',
        password: 'hashedpassword',
        status: true
      }
      chai.request(server)
        .post(API)
        .send(newUser)
        .end((req, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.success.should.be.eql(true)
          res.body.message.should.be.eql('Create account successfully!')
          done()
        })
    })

    it('It should not create new user if Email was taken', (done) => {
      let newUser1 = {
        email: 'test@gmail.com',
        fullName: 'Dong Tan Huy',
        password: 'hashedpassword',
        status: true
      }
      let newUser2 = {
        email: 'test@gmail.com',
        fullName: 'Dong Tan Huy',
        password: 'hashedpassword',
        status: true
      }
      chai.request(server)
        .post(API)
        .send(newUser1)
      chai.request(server)
        .post(API)
        .send(newUser2)
        .end((req, res) => {
          res.should.have.status(409)
          res.body.should.be.a('object')
          res.body.success.should.be.eql(false)
          res.body.message.should.be.eql('Email is taken, please enter other email address!')
          done()
        })
    })

    it('It should not create user if missing Email', (done) => {
      let newUser = {
        fullName: 'Dong Tan Huy',
        password: 'hashedpassword',
        status: true
      }
      chai.request(server)
        .post(API)
        .send(newUser)
        .end((req, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.success.should.be.eql(false)
          res.body.message.should.be.eql('Missing required fields!')
          done()
        })
    })
  })

  it('It should not create user if missing Fullname', (done) => {
    let newUser = {
      email: 'test@gmail.com',
      password: 'hashedpassword',
      status: true
    }
    chai.request(server)
      .post(API)
      .send(newUser)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.success.should.be.eql(false)
        res.body.message.should.be.eql('Missing required fields!')
        done()
      })
  })

  it('It should not create user if missing Password', (done) => {
    let newUser = {
      email: 'test@gmail.com',
      fullName: 'Dong Tan Huy',
      status: true
    }
    chai.request(server)
      .post(API)
      .send(newUser)
      .end((req, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.success.should.be.eql(false)
        res.body.message.should.be.eql('Missing required fields!')
        done()
      })
  })
})
