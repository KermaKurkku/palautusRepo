import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { addVote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => (
  <li>
    <div>
      {anecdote.content}
    </div>
    <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </div>
  </li>
)

const Anecdotes = (props) => {
  useEffect(() => {
    props.initializeAnecdotes()
  }, [props])
  return (
    <ul>
      {props.anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => 
            <Anecdote
              key={anecdote.id}
              anecdote={anecdote}
              handleClick={() => {
                props.addVote(anecdote.id)
                props.setNotification(`you voted '${anecdote.content}'`, 5)
              }
              }
            />
        )
      }
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes.filter(anecdote => anecdote.content.toUpperCase().indexOf(state.filter.toUpperCase()) > -1)
  }
}

const mapDispatchToProps = {
  initializeAnecdotes,
  addVote,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anecdotes)