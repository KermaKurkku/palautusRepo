//WIP 3.12
const mongoose = require('mongoose')

if (process.argv.length < 3)
{
    console.log('give password as argument')
    process.exit(1)
}



const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@fullstackopen.cvcor.mongodb.net/puhelinLuettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

// If no name is defined, print all contents
if (process.argv.length===3)
{
    console.log('phonebook:')
    Person.find({}).then(response => {
        response.forEach(p => console.log(`${p.name} ${p.number}`))
        mongoose.connection.close()
        process.exit(1)
    })
    
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save()
    .then(response => {
      console.log('number saved!', response)
      mongoose.connection.close()
    })
