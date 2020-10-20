import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Gather weather data from weatherstack
const Weather = ({ capital }) => {
  const [weather, setWeather] = useState([])
  const params = {
    access_key: process.env.REACT_APP_API_KEY,
    query: capital
  }
  useEffect(() =>{
    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        setWeather(response.data.current)
      }).catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <h2>Weather in {capital}</h2>
      <p><strong>temperature:</strong> {weather.temperature} celcius</p>
      {
          weather.weather_icons &&
            <img src={weather.weather_icons[0]} style={{width: '100px'}} alt='Weather icon' />          
      }
      <p><strong>wind:</strong> {weather.wind_speed} mph direction {weather.wind_dir}</p>
    </>
  )
  
}

const Country = ({ country }) => (
  <>
    {country.name}
  </>
)

// Return detailed information of one country
const OneCountry = ({ country }) => {


  return (
    <>
      <h2>{country.name}</h2>
      <p>capital {country.capital}<br/>
      population {country.population}</p>
      <h2>Languages</h2>
      <ul>
        {
          country.languages.map((language, index) => {
            
            return (
              <li key={index}>{language.name}</li>
            )
          })
        }
      </ul>
      <img src={country.flag} style={{width: '200px'}} alt=''/>
      <Weather capital={country.capital} />
    </>
  )
}

const Countries = ({ filtered }) => {
  // State of which country to show
  const [state, setState] = useState({
    country_display_code: null
  })

  // Change the country to show on click of button
  const handleClick = (countryCode) => {
    setState({
      country_display_code: countryCode
    })
  }

  return (
    filtered.map(country => {
      // Check if should return full info of country
      if (state.country_display_code === country.alpha2Code)
      {
        return (
          <div key={country.alpha2Code}>
            <Country country={country} />
            <OneCountry country={country} />
          </div>
        )
      } 
      // Else return name of country with a button
      else 
      {
        return (
          <div key={country.alpha2Code}>
            <Country country={country} />
            <button onClick={() => handleClick(country.alpha2Code)} >show</button>
          </div>
        )
      }
    })
  )
}

const Matches = ({ countries, filter }) => {
  const filtered = []
  countries.forEach(country => {
    if (country.name.toUpperCase().indexOf(filter.toUpperCase()) > -1)
    {
      filtered.push(country)
    }
  })

  if (filtered.length > 10)
  {
    return (
     <>
      <p>Too many matches, specify another filter</p>
     </> 
    )
  } else if (filtered.length === 1)
  {
    return (
      <>
        <OneCountry country={filtered[0]} />
      </>
    )
  } else 
  {
    return (
        <Countries filtered={filtered} />
    )
  }
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <div>
        filter shown with <input
          value={filter}
          onChange={handleFilterChange}>
        </input>
      </div>
        <Matches countries={countries} filter={filter} />
          
      </div>
  )
}

export default App