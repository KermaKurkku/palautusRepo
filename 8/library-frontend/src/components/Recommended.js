import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { FILTERED_BOOKS } from '../queries'

const Recommended = ({ show, user }) => {
	const [books, setBooks] = useState([])
	const [getBooks, result] = useLazyQuery(FILTERED_BOOKS)

	useEffect(() => {
		if (!user)
			return
		else
			getBooks({variables: { genre: user.favoriteGenre }}) // eslint-disable-next-line
	}, [show])

	useEffect(() => {
		if (result.data)
			setBooks(result.data.allBooks)
	}, [result])

	if (!show)
		return null

	if (!user)
		return <h2>loading...</h2>

	return (
		<div>
			<h2>recommendations</h2>

			<div>books in your favourite genre <strong>{user.favoriteGenre}</strong></div>
			<table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
		</div>
	)
}

export default Recommended