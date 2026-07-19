import { useEffect, useState } from 'react'
import axios from 'axios'

import CountryResults from './components/CountryResults'

const countriesUrl =
  'https://studies.cs.helsinki.fi/restcountries/api/all'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(countriesUrl)
      .then((response) => {
        setCountries(response.data)
      })
      .catch(() => {
        setError('Failed to load countries')
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const matchingCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {error ? (
        <p>{error}</p>
      ) : (
        <CountryResults
          countries={matchingCountries}
          selectedCountry={selectedCountry}
          onShow={showCountry}
        />
      )}
    </div>
  )
}

export default App
