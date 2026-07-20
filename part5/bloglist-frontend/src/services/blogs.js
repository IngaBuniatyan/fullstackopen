import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () =>
  axios.get(baseUrl).then((response) => response.data)

const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  return axios
    .post(baseUrl, newObject, config)
    .then((response) => response.data)
}

const update = (id, newObject) =>
  axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data)

const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }

  return axios.delete(`${baseUrl}/${id}`, config)
}

export default { create, getAll, remove, setToken, update }
