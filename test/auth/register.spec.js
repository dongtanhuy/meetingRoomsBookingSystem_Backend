/* global it, describe, beforeEach */
/* eslint no-unused-vars: "off" */
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../index')
const should = chai.should()
let User = require('../../model/User')
chai.use(chaiHttp)
const API = '/api/auth/register'

describe('Register', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      done(err)
    })
  })

  describe('/POST user', () => {
    it('It should create new user', (done) => {
      chai.request(server)
        .post(API)
        .end((req, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          // res.body.should.have.property('success')
          res.body.success.should.be.eql(true)
          res.body.message.should.be.eql('Create account successfully')
          done()
        })
    })
  })
})
