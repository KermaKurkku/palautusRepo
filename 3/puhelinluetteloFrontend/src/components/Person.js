import React from 'react'

// Renders the details of a single person
// Uses a table to keep website clean
const Person = ({ name, number, deletePerson }) => (

    <tr>
        <td>{name}</td> 
        <td>{number}</td>
        <td>
            <button onClick={deletePerson}>Delete</button>
        </td>
    </tr>
)

export default Person