import anecdoteService from '../services/anecdotes'

export const addVote = (id) => {
  return async dispatch => {
    const anecdoteToUpdate = await anecdoteService.getOne(id)
    const updatedAnecdote = {
      ...anecdoteToUpdate,
      votes: anecdoteToUpdate.votes + 1
    }
    const update = await anecdoteService.updateAnecdote(id, updatedAnecdote)
    dispatch({
      type: 'UPDATE',
      id: id,
      data: update
    })
  }
}

export const addAnecdote = content => {
  return async dispatch => {
	  const newAnecdote = await anecdoteService.createNew(content)
	  dispatch({
		  type: 'ADD',
		  data: newAnecdote
	  })
  }
}

export const initializeAnecdotes = () => {
	return async dispatch => {
		const anecdotes = await anecdoteService.getAll()
		dispatch({
			type: 'INIT_ANECDOTES',
			data: anecdotes
		})
	}
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToUpdate = state.find(a => a.id === id)
      const updatedAnecdote = {
        ...anecdoteToUpdate,
        votes: anecdoteToUpdate.votes + 1
      }
      return state.map(a => a.id !== id ? a : updatedAnecdote)
    case 'ADD':
      console.log(action.data)
      return [...state, action.data]
    case 'UPDATE':
      return state.map(anecdote => anecdote.id !== action.id ? anecdote : action.data)
	  case 'INIT_ANECDOTES':
		  return action.data
    default:
      return state
  }
}

export default reducer