export let getTokenFromHeaders = (headers) => {
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
