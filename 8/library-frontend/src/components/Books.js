import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, FILTERED_BOOKS } from '../queries'

import '../styles.css'

const Books = (props) => {
	const [books, setBooks] = useState([])
	const [filter, setFilter] = useState('all genres')
	const [getBookByGenre, result] = useLazyQuery(FILTERED_BOOKS)

	const allBooks = useQuery(ALL_BOOKS)

	useEffect(() => {
		if (allBooks.loading)
			return
		if (filter === 'all genres') {
			setBooks(allBooks.data.allBooks)
			return
		}
		if (result.data)
			setBooks(result.data.allBooks) // eslint-disable-next-line
	}, [allBooks, result, filter])

	useEffect(() => {
		if (filter === 'all genres')
			return
		getBookByGenre({ variables: { genre: filter }}) // eslint-disable-next-line
	}, [filter])

  if (!props.show) {
    return null
	}
	
	if (allBooks.loading)
		return <h3>books loading...</h3>

	const genres = allBooks.data.allBooks.map(b => b.genres).reduce((genret, genre) => {
		return genret.concat(genre)
	}, [])
	
	const options = ['all genres', ...new Set(genres)]

  return (
    <div>
      <h2>books</h2>

			<div>in genre <Select 
				defaultValue={options[0]}
				classNamePrefix='react-select'
				className='react-select--inline'
				components={{
					IndicatorsContainer: () => null
				}}
				options={options.map(g => ({value: g, label: g }))}
				onChange={(target) => setFilter(target.value)}
			/></div>

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

export default Books