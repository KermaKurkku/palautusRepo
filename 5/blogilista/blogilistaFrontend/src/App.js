import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setUser(user)
      setUser(user)

    }
  }, [])

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnObject = await blogService
      .create(blogObject)
    setBlogs(blogs.concat(returnObject))


    setMessageType('info')
    setTimeout(() => {
      setMessage(`a new blog ${returnObject.title} by ${returnObject.author} added`)
    }, 5000)
  }

  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter(b => b.id !== id))
  }

  const addLike = async id => {
    await blogService.addLike(id)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setUser(user)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageType('error')
      setMessage('incorrect credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.removeUser()
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const blogFormRef = useRef()

  const loginForm = () => (
    <div>
      <h2>log in</h2>
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={handleUsernameChange}
        setPassword={handlePasswordChange}
      />
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
      <BlogForm
        createBlog={createBlog}
      />

    </Togglable>
  )

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={message} type={messageType} />
      {
        user === null
          ? loginForm()
          : <div>
            <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
            {blogForm()}
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog =>
                <Blog key={blog.id} blog={blog} addLike={addLike} deleteABlog={deleteBlog} />
              )}
          </div>
      }
    </div>
  )
}

export default App