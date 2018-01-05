const attachListeners = () => {
  console.log('Attaching event listeners...')

  if (localStorage.getItem('logged_in')) {
    document.getElementById('login-form').style.display = 'none'
    document.getElementById('logged-in').style.display = 'block'

    return
  }

  document.getElementById('login-form').addEventListener('submit', submitLoginForm)
  document.getElementById('two-factor-form').addEventListener('submit', submit2FAForm)
}

const proceedToTwoFactorForm = (res) => {
  localStorage.setItem('userId', res.data.userId)

  document.getElementById('login-form').style.display = 'none'
  document.getElementById('two-factor-form').style.display = 'block'
}

const showLoginError = () => {
  document.getElementById('login-error').style.display = 'block'
}

const hideLoginError = () => {
  document.getElementById('login-error').style.display = 'block'
}

const submitLoginForm = (e) => {
  e.preventDefault()

  hideLoginError()

  const username = input('username')
  const password = input('password')

  axios
    .post(url('login'), { username, password })
    .then(proceedToTwoFactorForm)
    .catch(showLoginError)
}

const showLoggedInPage = () => {
  document.getElementById('logged-in-page').style.display = 'block'
  document.getElementById('two-factor-form').style.display = 'none'
}

const showOneTimePasswordError = () => {
  document.getElementById('one-time-password-error').style.display = 'block'
}

const submit2FAForm = (e) => {
  e.preventDefault()

  document.getElementById('one-time-password-error').style.display = 'none'
  const token = input('token')
  const userId = localStorage.getItem('userId')

  axios
    .post(url('auth/token'), { token, userId })
    .then(login)
    .catch(showOneTimePasswordError)
}

const setup = () => {
  attachListeners()
}

document.addEventListener('DOMContentLoaded', setup)