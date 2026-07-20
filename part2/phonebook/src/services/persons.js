import axios from 'axios'

const baseUrl = '/api/persons'

export const getAll = () =>
  axios.get(baseUrl).then((response) => response.data)

export const create = (newObject) =>
  axios.post(baseUrl, newObject).then((response) => response.data)

export const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((response) => response.data)

export const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => response.data)

export default { getAll, create, update, remove }
