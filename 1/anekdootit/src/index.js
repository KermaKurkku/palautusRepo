import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const ScoreCounter = (props) => (
  <>
    <p>has {props.votes} votes</p>
  </>
)


const mostVotes = (votes) => {
  let highest = 0
  let highestID = 0
  for (let i = 0; i < anecdotes.length; i++)
  {
    if (votes[i] > highest)
    {
      highest = votes[i]
      highestID = i
    }
  }

  if (highest === 0)
  {
    return
  } else {
    return highestID
  }
}


const App =(props) => {
  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState(Array.apply(null, new Array(anecdotes.length + 1).join('0').split('').map(parseFloat)))

  const addPoints = () => {
    const copy = {...votes}
    copy[selected] += 1
    setVotes(copy)

  }

  const nextAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <ScoreCounter votes={votes[selected]} />
      <Button handleClick={addPoints} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote"/>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[mostVotes(votes)]}</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
<App anecdotes ={anecdotes}/>, 
  document.getElementById('root')
 );

