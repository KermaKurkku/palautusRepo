const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

mongoose.set('useFindAndModify', false)

mongoose.set('useCreateIndex', true)

console.log('connecting to MongoDB')

const MONGODB_URI = process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`connected to ${MONGODB_URI}`)
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
	})
	
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const typeDefs = gql`
	type Book {
		title: String!
		published: Int!
		author: Author!
		id: ID!
		genres: [String!]!
	}

	type Author {
		name: String!
		id: ID!
		born: Int
		bookCount: Int!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

  type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}
	
	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
		editAuthor(
			name: String!
			setBornTo: Int!
		): Author
		createUser(
			username: String!
			favoriteGenre: String!
		): User
		login(
			username: String!
			password: String!
		): Token
	}
	type Subscription {
		bookAdded: Book!
	}
`

const resolvers = {
  Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			let returnBooks = await Book.find({}).populate('author')

			const byAuthor = (book) => 
					args.author === book.author.name ? true : false

			const byGenre = (book) => 
					book.genres.filter(g => g === args.genre).length > 0 ? true : false

			if (args.author) 
				returnBooks = returnBooks.filter(byAuthor)

			if (args.genre) 
				returnBooks = returnBooks.filter(byGenre)
			
			return returnBooks
		},
		allAuthors: () => Author.find({}),
		me: (root, args, context) => {
			return context.currentUser
		}
	},
	Mutation: {
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser

			if (!currentUser) 
				throw new AuthenticationError('not authenticated')

			const author = await Author.findOne({name: args.author}) || null

			const saveAuthor = new Author({
				name: args.author,
				born: null
			})

			try {
				const newAuthor = !author ?
					await saveAuthor.save() : null
				const book = new Book({ ...args, author: author || newAuthor})

				await book.save()
				console.log('book saved')
				pubsub.publish('BOOK_ADDED', { bookAdded: book })

				const bookCount = await Book.find({
					author: !author ? newAuthor._id : author._id
				}).countDocuments()

				await Author.findOneAndUpdate(
					{ name: !author ? newAuthor.name : author.name},
					{ bookCount }
				)

				return book
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args
				})
			} 
			
		},
		editAuthor: async (root, args, context) => {
			const currentUser = context.currentUser

			if (!currentUser)
				throw new AuthenticationError('not authenticated')
			const author = await Author.findOne({ name: args.name }) || null
			if (!author)
				throw new UserInputError('no author found', {
					invalidArgs: args.name
				})
			author.born = args.setBornTo
			
			try {
				await author.save()
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args
				})
			}

			return author
		},
		createUser: (root, args) => {
			const user = new User({ ...args })

			return user.save()
				.catch(error => {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				})
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })

			if ( !user || args.password !== 'secret' ) 
				throw new UserInputError('wrong credentials')

			const userForToken = {
				username: user.username,
				id: user._id
			}

			return { value: jwt.sign(userForToken, JWT_SECRET) }

		}
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
		}
	}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
				.findById(decodedToken.id)

      return { currentUser }
    }
  }  
})

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`)
	console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})