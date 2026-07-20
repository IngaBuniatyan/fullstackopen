import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => axios.get(baseUrl).then((response) => response.data)

const create = (blog) =>
  axios
    .post(baseUrl, blog, {
      headers: { Authorization: token },
    })
    .then((response) => response.data)

const update = (id, blog) =>
  axios.put(`${baseUrl}/${id}`, blog).then((response) => response.data)

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: token },
  })

const addComment = (id, comment) =>
  axios
    .post(`${baseUrl}/${id}/comments`, { comment })
    .then((response) => response.data)

export default { addComment, create, getAll, remove, setToken, update }
