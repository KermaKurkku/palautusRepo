const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const logger = require('../utils/logger.js')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { username: 1, name: 1, id: 1 })
	response.json(blogs.map(b => b.toJSON()))
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	response.json(blog)
})

blogRouter.post('/', async (request, response) => {
	logger.info(request.body)
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id)
	{
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const user = await User.findById(decodedToken.id)


	const blog = new Blog({
		title: request.body.title,
		author: request.body.author,
		user: user._id,
		url: request.body.url,
		likes: request.body.likes || 0,
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	response.json(savedBlog.toJSON())
})

blogRouter.put('/:id', async (request, response) => {
	const body = request.body

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	response.json(updatedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id)
	{
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const user = await User.findById(decodedToken.id)
	const blog = await Blog.findById(request.params.id)
	console.log('user ==blog', blog.user._id.toString() === user.id.toString())
	if (blog.user._id.toString() === user.id.toString())
	{
		await Blog.findByIdAndRemove(request.params.id)
		return response.status(204).end()
	}
	response.status(400).json({ error: 'cannot remove other user\'s blogs' })

})

module.exports = blogRouter