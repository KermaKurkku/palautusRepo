// WIP step 12
import React, { useState, useEffect } from 'react'

import Person from './components/Person'
import Notification from './components/Notification'
import personService from "./services/persons"

// Creates the field for a filter
const Filter = (props) => {
    return (
        <>
            filter shown with<input
                value={props.filter}
                onChange={props.handler}
            >
            </input>
        </>
    )
}

// Creates the input fields for receiving the name and number
const PersonForm = (props) => {
    return (
        <>
            <form>
                <table>
                    <tbody>
                        <tr>
                            <td>name: </td>
                            <td><input 
                                value={props.name}
                                onChange={props.handleName}
                            /></td>
                        </tr>
                        <tr>
                            <td>number: </td>
                            <td><input 
                                value={props.number}
                                onChange={props.handleNumber}
                            /></td>
                        </tr>
                    </tbody>                    
                </table>
                <div>
                    <button type="submit"
                            onClick={props.add}>
                        add
                    </button>
                </div>
            </form> 
        </>
    )
}



// Renders all persons that fit into the filter
const Persons = ({ persons, filter, delPerson}) => {
    return (
        persons.map(person => {
            if (person.name.toUpperCase().indexOf(filter.toUpperCase()) > -1)
            {
                return (
                    <Person 
                        key={person.name} 
                        name={person.name} 
                        number={person.number} 
                        deletePerson={() => delPerson(person)}
                    />
               )
            } else {
                return null
            }
        })  
    )
    
}


const App = () => {
    const [ persons, setPersons] = useState([]) 
    const [ newName, setNewName ] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)
    const [type, setType] = useState('error')

    let add = true

    useEffect(() => {
        personService
            .getAll()
            .then(InitialPersons => {
                setPersons(InitialPersons)
            })
    }, [])

    const showMessage = (type, message) => {
        setType(type)
        setMessage(message)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const addPerson = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber,
        }
        if(persons.some(person => person.name === newName))
        {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
            {
                const person = persons.find(p => p.name === newName)
                const changedPerson = {...person, number: newNumber}
                personService
                    .updateNumber(persons.find(p => p.name === newName).id, changedPerson)
                    .then(updatePerson => {
                        setPersons(persons.map(p => p.name !== newName ? p : changedPerson))
                        showMessage('info', `'${updatePerson.name}' updated`)
                    })
                    .catch(error => {
                        showMessage('error', `Information of '${person.name}' has been removed from the server`)
                        setPersons(persons.filter(p => p.id !== person.id))
                    })
            } 
            add = false
        } 

        if (add)
        {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    showMessage('info', `'${returnedPerson.name}' added`)
                })
        }
        setNewName('')
        setNewNumber('')
    }

    const deletePerson = person => {
        if (window.confirm(`Delete ${person.name}?`))
        {
            personService
                .deletePerson(person.id)
                .catch(error => {
                    showMessage('error', `Error, ${person.name} does not exist on the server`)
                })
           
                setPersons(persons.filter(p => p.id !== person.id))
                showMessage('info', `'${person.name}' deleted`)
              
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} type={type}/>
            <Filter filter={filter} handler={handleFilterChange} />
            <h3>Add new</h3>
            
            <PersonForm name={newName} handleName={handleNameChange}
                number={newNumber} handleNumber={handleNumberChange}
                add={addPerson} />
            
            <h3>Numbers</h3>
            <table>
                <tbody>
                    <Persons 
                        persons={persons} 
                        filter={filter} 
                        delPerson={deletePerson}
                    />
                </tbody>
            </table>
            
        </div>
    )

}

export default App