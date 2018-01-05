const url = path => `http://localhost:3050/${path}`
const input = id => document.getElementById(id).value

const login = () => {
  localStorage.setItem('logged_in', true)
  window.location.href = '/'
}

const logout = () => {
  localStorage.clear()
  window.location.href = '/'
}