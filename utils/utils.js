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

exports.validate = (session, bookings) => {
  // console.log('New: ', session)
  // console.log('Current: ', bookings)
  let s = new Date(session.startAt).getTime()
  let e = new Date(session.endAt).getTime()
  let result = true

  if (bookings === null || bookings.length === 0) {
    result = true
  } else {
    for (let item of bookings) {
      let s1 = new Date(item.startAt).getTime()
      let e1 = new Date(item.endAt).getTime()
      // console.log('s:', s)
      // console.log('e:', e)
      // console.log('s1:', s1)
      // console.log('e1:', e1)
      if (e > s1 && s < s1) {
        console.log('S < S1 < E')
        result = false
      } else if (s < e1 && e > e1) {
        console.log('S < E1 < E')
        result = false
      } else if (s < s1 && e > e1) {
        console.log('S < S1 && E > E1')
        result = false
      } else if (s > s1 && e < e1) {
        console.log('S1 < S < E < E1')
        result = false
      } else {
        console.log('OK')
        result = true
      }
    }
  }
  console.log(result)
  return result
}
