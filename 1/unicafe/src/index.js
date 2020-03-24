import React, {useState} from 'react';
import ReactDOM from 'react-dom';

// Implement buttons
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

// Component for a single stat line
const StatisticLine = (props) => (
  <tr>
    <th>{props.type}</th>
    <td>{props.value}</td>
  </tr>
)

// Component for showing statistics
// Creates a table of StatisticLines
const Statistics = (props) => {
  
  return (
    <>
    <table>
      <tbody>
          <StatisticLine type="good" value={props.good} />
          <StatisticLine type="neutral" value={props.neutral} />
          <StatisticLine type="bad" value={props.bad} />
          <StatisticLine type="average" value={CalculateAverage(props.value, props.total)} />
          <StatisticLine type="positive" value={CalculatePositive(props.good, props.total)} />
        </tbody>
      </table>
    </>
  )
}

// Calculate average of all scores
const CalculateAverage = (value, count) => (
  value/count || 0
)

// Calculate positive percentage
const CalculatePositive = (positive, count) => (
  (positive/count * 100 || 0) + '%'
)
  

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [value, setValue] = useState(0)

  // Increment 'good' value
  const goodClick = () => {
    setGood(good +1)
    setValue(value +1)
  }

  // Increment 'neutral' value
  const neutralClick = () => {
    setNeutral(neutral + 1)
  }

  // Increment 'bad' value
  const badClick = () => {
    setBad(bad + 1)
    setValue(value - 1)
  }
  

  // Don't render empty stats
  if ((good+bad+neutral) === 0)
  {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={goodClick} text="good" />
        <Button handleClick={neutralClick} text="neutral" />
        <Button handleClick={badClick} text="bad" />
        <h1>statistics</h1> 
        <p>No feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={goodClick} text="good" />
        <Button handleClick={neutralClick} text="neutral" />
        <Button handleClick={badClick} text="bad" />
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} value={value} total={good+bad+neutral} />
      </div>
    )  
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

