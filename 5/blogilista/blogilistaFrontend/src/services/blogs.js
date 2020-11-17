import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let currentUser = null

const setUser = (user) => {
  currentUser = user
  token = `bearer ${user.token}`
}

const removeUser = () => {
  token = null
}

const getUserById = async userid => {
  const user = await axios.get(`/api/users/${userid}`)

  return user.data

}

const matchToCurrentUser = async userId => {
  const user = await getUserById(userId)
  return user.username === currentUser.username
} 

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLike = async id => {
  const blogToUpdate = await axios.get(baseUrl + '/' + id)
  blogToUpdate.data.likes += 1
  await axios.put(baseUrl + '/' + id, blogToUpdate.data)
}

const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

export default {
  setUser,
  removeUser,
  getUserById,
  matchToCurrentUser,
  getAll,
  create,
  addLike,
  deleteBlog
}