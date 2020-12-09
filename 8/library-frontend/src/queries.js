import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		published
		author {
			name
			born
			bookCount
		}
		genres
		id
	}
`

export const ALL_BOOKS = gql`
	query {
		allBooks {
			title
			published
			author {
				name
				born
				bookCount
			}
			id
			genres
		}
	}
`

export const FILTERED_BOOKS = gql`
	query filterBooksByGenre($genre: String!){
		allBooks(genre: $genre) {
			title
			published
			author {
				name
				born
				bookCount
			}
			id
			genres
		}
	}
`

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
			bookCount
			id
		}
	}
`

export const ME = gql`
	query {
		me {
			username
			favoriteGenre
			id
		}
	}	
`

export const CREATE_BOOK = gql`
	mutation createBook( $title: String!, $author: String!, $published: Int!, $genres: [String!]! ) {
		addBook(
			title: $title,
			author: $author,
			published: $published,
			genres: $genres
		) {
			title
			author {
				name
				born
				id
				bookCount
			}
			published
			genres
			id
		}
	}
`

export const EDIT_AUTHOR = gql`
	mutation editAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name:  $name, setBornTo: $setBornTo) {
			name
			born
			id
			bookCount
		}
	}
`

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`