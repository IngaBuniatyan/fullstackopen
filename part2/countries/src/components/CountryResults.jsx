import Country from './Country'

const CountryResults = ({ countries, selectedCountry, onShow }) => {
  if (selectedCountry) {
    return <Country country={selectedCountry} />
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  if (countries.length >= 2) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => onShow(country)}>show</button>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default CountryResults
