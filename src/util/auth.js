import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenAuthorizationKey = 'authorization'

export function getToken() {
  return Cookies.get()
}


export function setAuthorizationToken(token) {
  return Cookies.set(TokenAuthorizationKey, token)
}

export function removeToken() {
  return Cookies.remove()
}

export function actionAccount() {
  const accountArr = ['18791admin']
  const userString = localStorage.getItem('user')
  const user = JSON.parse(userString)
  const account = user.name
  return accountArr.includes(account)
}
