import React, {useState, useEffect } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthYearForm = (authors) => {
	const [name, setName] = useState(null)
	const [setBornTo, setBirthYear] = useState('')

	const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }]
	})

	const submit = async (event) => {
		event.preventDefault()

		editAuthor({ variables: {name: name.value, setBornTo}})
		setName('')
		setBirthYear('')
	}

	useEffect(() => {
		if (result.data && result.data.editAuthor === null) {
			console.log('error')
		}
	}, [result.data])

	return (
		<div>
			<h2>Set birthyear</h2>
			<form onSubmit={submit}>
				<Select
					value={name}
					options={authors.authors.map(a => ({value: a.name, label: a.name }))}
					onChange={setName}

				/>
				<div>
					born <input
						value={setBornTo}
						onChange={({ target }) => setBirthYear(parseInt(target.value))}
					/>
				</div>
				<button type='submit'>update author</button>
			</form>
		</div>
	)
} 

export default BirthYearForm