/* global it, describe, should */
/* eslint no-unused-vars: "off" */
const chai = require('chai')

const chaiHttp = require('chai-http')

const server = require('../../index')

const should = chai.should()

chai.use(chaiHttp)
const API = '/api/auth/login'
describe('Test', () => {
  it('Test login demo', (done) => {
    chai.request(server)
      .get(API)
      .end((req, res) => {
        res.should.have.status(200)
        res.body.should.have.property('hello')
        done()
      })
  })
})
