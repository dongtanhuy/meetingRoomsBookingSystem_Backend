exports.getTokenFromHeaders = (headers) => {
  if (headers && headers.token) {
    let token = headers.token
    let tokenArray = token.split(' ')
    if (tokenArray.length === 2) {
      return tokenArray[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

exports.extractToken = (tokenString) => {
  let tokenArray = tokenString.split(' ')
  if (tokenArray.length === 2) {
    return tokenArray[1]
  } else {
    return null
  }
}
const nodemailer = require('nodemailer')
let id = process.env.Gmail_CLIENT_ID
exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: id,
    clientSecret: 'TCwhlet5qvA1MVVfwrwismDL'
  }
})
