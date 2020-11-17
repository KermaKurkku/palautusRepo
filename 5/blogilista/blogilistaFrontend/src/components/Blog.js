import React, { useState } from 'react'
import blogRouter from '../services/blogs'

const Blog = ({ blog, addLike, deleteABlog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [owner, setOwner] = useState(false)

  const blogUserId = blog.user.id || blog.user
  const id = blog.id

  const changeVisible = async () => {
    setVisible(!visible)
    await checkIfMatchingUser() === true ?
      setOwner(true) :
      setOwner(false)

  }

  const likeBlog = async () => {
    await addLike(id)
    setLikes(likes + 1)
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await deleteABlog(blog.id)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const checkIfMatchingUser = async () => {
    const matches = await blogRouter.matchToCurrentUser(blogUserId)
    return matches
  }
  return (
    <div style={blogStyle} >
      {blog.title}, {blog.author} <button onClick={changeVisible}>show...</button>

      <div style={showWhenVisible} className='details'>
        {blog.url}<br />
        Likes {likes} <button onClick={likeBlog}>like</button><br />
        {blog.user.name}<br />
        {
          owner === true
            ? <button onClick={deleteBlog}>delete blog</button>
            : null
        }
      </div>


    </div>
  )
}

export default Blog
