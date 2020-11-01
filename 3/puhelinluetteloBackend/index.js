//DONE 3.20
require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body) || null)

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body' || null))

/* let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
] */

app.get('/api/info', (request, response) => {
    Person.find({}).then(people => {
        const info = `Phonebook has info for ${people.length} people`
        response.write(info)
        response.write("\n"+String(new Date()))
        response.end()
    })
    
    

})

app.get('/api/people', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/people/:id', (request, response, next) => {
    Person.findById(request.params.id).then(note => {
        if (note)
        {
            response.json(note)
        } else 
        {
            return next({
                name: 'NoPersonError',
                message: `no person found with id ${request.params.id}`
            })
        }
    }).catch(error => next(error))
})

app.post('/api/people', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
    
})

app.put('/api/people/:id', (request, response, next) => {
    console.log('request',request.params.id)
    person = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatePerson => {
            response.json(updatePerson)
        }).catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error('error message:', error.message)

    if (error.name === 'CastError')
    {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError')
    {
        return response.status(400).send({ error: error.message })
    }

    if (error.name === 'NoPersonError')
    {
        return response.status(404).send({ error: 'no person found'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)