import axios from 'axios'

const login = (credentials) =>
  axios.post('/api/login', credentials).then((response) => response.data)

export default { login }
