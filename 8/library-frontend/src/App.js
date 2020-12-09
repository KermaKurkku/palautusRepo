
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'

import { ME, BOOK_ADDED, ALL_BOOKS } from './queries'

const Notify = ({notification}) => {

	if (notification.message === null)
		return null
	
	const style = {
		color: notification.type === 'error' ? 'red' : 'green'
	}
	return (
		<div style={style}>
			{notification.message}
		</div>
	)
}



const App = () => {
	const [token, setToken] = useState(null)
	const [user, setUser] = useState(null)
	const [page, setPage] = useState('authors')
	const [notification, setNotification] = useState({message: null, type: null})
	const client = useApolloClient()

	const [getUser, results] = useLazyQuery(ME)

	const updateCacheWith = (addedBook) => {
		const includedIn = (set, object) => 
			set.map(p => p.id).includes(object.id)

		const dataInStore = client.readQuery({ query: ALL_BOOKS })
		if (!includedIn(dataInStore.allBooks, addedBook)) {
			client.writeQuery({
				query: ALL_BOOKS,
				data: { allBooks: dataInStore.allBooks.concat(addedBook)}
			})
		}
	}

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			const addedBook = subscriptionData.data.bookAdded
			notify({message: `${subscriptionData.data.bookAdded.title} by ${subscriptionData.data.bookAdded.author.name} added`, type: ''})
			updateCacheWith(addedBook)
		
		}
	})

	useEffect(() => {
		if (user)
			return
		getUser() // eslint-disable-next-line
	}, [token, page])

	useEffect(() => {
		if (results.data)
			setUser(results.data.me) // eslint-disable-next-line
	}, [results.loading])

	useEffect(() => {
		const token = localStorage.getItem('library-authorization-token')
		if (token)
			setToken(token)
	}, [])

	const notify = ({ message, type}) => {
		setNotification({  message, type })
		setTimeout(() => {
			setNotification({ message: null, type: null })
		}, 10000)
	}
	
	const setLogin = (token) => {
		setToken(token)
		setPage('authors')
	}

	const logout = () => {
		setPage('authors')
		setUser(null)
		setToken(null)
		localStorage.clear()
		client.resetStore()
		
	}

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
				{token&&<button onClick={() => setPage('add')}>add book</button>}
				{token&&<button onClick={() => setPage('recommended')}>recommended</button>}
				{token&&<button onClick={logout}>logout</button>}
				{!token&&<button onClick={() => setPage('login')}>login</button>}
				
      </div>

			<Notify notification={notification} />

      <Authors
				show={page === 'authors'}
				token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
				show={page === 'add'}
				setError={notify}
      />

			<Recommended
				show={page === 'recommended'}
				user={user}
			/>

			<LoginForm
				show={page === 'login'}
				setError={notify}
				setToken={setLogin}
			/>

    </div>
  )
}

export default App