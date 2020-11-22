import React from 'react'
import { connect } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
	event.target.anecdote.value = ''
	props.addAnecdote(content)
	props.setNotification(`new anecdote ${content}`, 5)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

const mapDispatchToProps = {
	addAnecdote,
	setNotification
}

export default connect(
	null,
	mapDispatchToProps
)(AnecdoteForm)