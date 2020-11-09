const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user.js')

describe('with some blogs initially', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })

		await user.save()
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await helper.blogsInDb()
		expect(response).toHaveLength(helper.initialBlogs.length)
	})

	test('blogs need to have field: id in their JSON format', async () => {
		const response = await helper.blogsInDb()
		expect(response[0].id).toBeDefined()
	})
	describe('adding a new blog', () => {
		test('blogs can be added through POST', async () => {
			// getting a user's token
			const user = {
				username: 'root',
				password: 'sekret'
			}
			const userLogin = await api
				.post('/api/login')
				.send(user)

			const newBlog = {
				title: 'This is for testing purposes',
				author: 'Meee',
				url: '123.testing.zxc',
				likes: 2
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.set( 'Authorization', 'Bearer '+userLogin.body.token )
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const blogsAfterPost = await helper.blogsInDb()
			expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)
			blogsAfterPost.forEach(b => {
				delete b.id
				delete b.user
			})
			expect(blogsAfterPost).toContainEqual(
				newBlog
			)
		})

		test('blog can be added without a value for likes', async () => {
			// getting a user's token
			const user = {
				username: 'root',
				password: 'sekret'
			}
			const userLogin = await api
				.post('/api/login')
				.send(user)

			const newBlog = {
				title: 'This is for testing purposes',
				author: 'Meee',
				url: '123.testing.zxc'
			}

			const addedBlog = await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer '+userLogin.body.token)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const blogsAfterPost = await helper.blogsInDb()
			expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

			expect(addedBlog.body.likes).toBe(0)
		})

		test('blogs cannot be added without title and url', async () => {
			// getting a user's token
			const user = {
				username: 'root',
				password: 'sekret'
			}
			const userLogin = await api
				.post('/api/login')
				.send(user)


			const newBlog = {
				author: 'Testing',
				likes: 21
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer '+userLogin.body.token)
				.expect(400)
		})

		test('creation of blog fails without a valid token', async () => {
			const newBlog = {
				title: 'This is for testing purposes',
				author: 'Meee',
				url: '123.testing.zxc',
				likes: 2
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(401)
		})
	})

	describe('deletion of a blog', () => {
		test('blog can be deleted with status code 204', async () => {
			// getting a user's token
			const user = {
				username: 'root',
				password: 'sekret'
			}
			const userLogin = await api
				.post('/api/login')
				.send(user)

			const newBlog = {
				title: 'This is for testing purposes',
				author: 'Meee',
				url: '123.testing.zxc',
				likes: 2
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.set( 'Authorization', 'Bearer '+userLogin.body.token )
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const currentBlogs = await helper.blogsInDb()

			const blogToDelete = currentBlogs[currentBlogs.length-1]

			await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.set('Authorization', 'Bearer '+userLogin.body.token)
				.expect(204)

			const blogsAtEnd = await helper.blogsInDb()

			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

			blogsAtEnd.forEach(b => delete b.id)
			expect(blogsAtEnd).not.toContainEqual(blogToDelete)
		})
	})

	describe('updating of a blog', () => {
		test('blog can be updated', async () => {
			const blogsAtStart = await helper.blogsInDb()

			const blogtoUpdate = {
				title: 'update',
				author: 'update',
				url: 'update',
				likes: 1
			}

			await api
				.put(`/api/blogs/${blogsAtStart[0].id}`)
				.send(blogtoUpdate)
				.expect(200)
		})
	})

})

describe('User management', () => {
	describe('with one user initially in db', () => {
		beforeEach(async () => {
			await User.deleteMany({})

			const passwordHash = await bcrypt.hash('sekret', 10)
			const user = new User({ username: 'root', passwordHash })

			await user.save()
		})

		test('creation succeeds with a fresh username', async () => {
			const usersAtStart = await helper.usersInDb()

			const newUser = {
				username: 'testing',
				name: 'Test Dude',
				password: 'yeet'
			}

			await api
				.post('/api/users')
				.send(newUser)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const usersAtEnd = await helper.usersInDb()
			expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

			const usernames = usersAtEnd.map(u => u.username)
			expect(usernames).toContain(newUser.username)
		})

		test('creation fails if username is in use', async () => {
			const newUser = {
				username: 'root',
				name: 'Test',
				password: 'yeet'
			}

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
		})
	})

	describe('with incorrect parameters', () => {
		test('creation fails with no password', async () => {
			const newUser = {
				username: 'test',
				name: 'test'
			}

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
		})

		test('creation fails with a password shorter than 3 characters', async () => {
			const newUser = {
				username: 'test',
				name: 'test',
				password: 'te'
			}

			await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
		})
	})
})



afterAll(() => {
	mongoose.connection.close()
})