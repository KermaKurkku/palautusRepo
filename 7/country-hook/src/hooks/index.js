import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name !== '')
      axios.get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
        .then(response => {
          const found = true
          setCountry({data:response.data[0], found})
        })
        .catch(error => {
          console.log('Error', error)
          const found = false
          setCountry({found})
        })
  }, [name])

  return country
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

