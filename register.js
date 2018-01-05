const attachListeners = () => {
  console.log('Attaching event listeners...')

  document.getElementById('register-form').addEventListener('submit', submitRegisterForm)
  document.getElementById('two-factor-method-form').addEventListener('submit', submit2FAMethodForm)
  document.getElementById('qr-code-form').addEventListener('submit', submitQRCodeForm)
  document.getElementById('sms-form').addEventListener('submit', submitSMSForm)

  document.getElementById('sms').addEventListener('click', showPhoneNumberField)
  document.getElementById('totp').addEventListener('click', hidePhoneNumberField)
}

const showPhoneNumberField = () => {
  document.getElementById('phone-number-control').style.display = 'block'
}

const hidePhoneNumberField = () => {
  document.getElementById('phone-number-control').style.display = 'none'
}

const submitRegisterForm = (e) => {
  e.preventDefault()

  const username = input('username')
  const password = input('password')

  axios.post(url('register'), { username, password })
    .then(proceedToTwoFactorMethodForm)
    .catch(() => alert('nope'))
}

const proceedToTwoFactorMethodStep = (method) =>
  method === 'totp'
  ? showQRCodeForm
  : showSMSForm

const proceedToTwoFactorMethodForm = (res) => {
  localStorage.setItem('userId', res.data.userId)
  document.getElementById('register-form').style.display = 'none'
  document.getElementById('two-factor-method-form').style.display = 'block'
}

const showQRCodeForm = (res) => {
  const qrCodeForm = document.getElementById('qr-code-form')
  document.getElementById('two-factor-method-form').style.display = 'none'

  qrCode = document.createElement('img')
  qrCode.src = res.data.qr

  qrCodeForm.querySelector('.qr-image').appendChild(qrCode)
  qrCodeForm.style.display = 'block'
}

const showSMSForm = (res) => {
  document.getElementById('phone-number-show').innerHTML = res.data.phoneNumber
  document.getElementById('sms-form').style.display = 'block'
  document.getElementById('two-factor-method-form').style.display = 'none'
}

const submit2FAMethodForm = (e) => {
  e.preventDefault()

  const method = document.querySelector('input[name="two-factor-method"]:checked').value
  const phoneNumber = input('phone_number')
  const userId = localStorage.getItem('userId')

  axios
    .post(url('auth/setup'), { method, phoneNumber, userId })
    .then(proceedToTwoFactorMethodStep(method))
    .catch(() => alert('oops'))
}

const showQRCodeError = () => {
  document.getElementById('qr-code-error').style.display = 'block'
}

const showSMSCodeError = () => {
  document.getElementById('sms-code-error').style.display = 'block'
}

const submitQRCodeForm = (e) => {
  e.preventDefault()

  const token = input('token')
  const userId = localStorage.getItem('userId')

  axios
    .post(url('auth/validate'), { userId, token })
    .then(login)
    .catch(showQRCodeError)
}

const submitSMSForm = (e) => {
  e.preventDefault()

  const token = input('sms_token')
  const userId = localStorage.getItem('userId')

  axios
    .post(url('auth/validate'), { method: 'sms', userId, token })
    .then(login)
    .catch(showSMSCodeError)
}

const setup = () => {
  attachListeners()
}

document.addEventListener('DOMContentLoaded', setup)