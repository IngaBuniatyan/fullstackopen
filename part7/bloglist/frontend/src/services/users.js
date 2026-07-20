import axios from 'axios'

const getAll = () => axios.get('/api/users').then((response) => response.data)

export default { getAll }
