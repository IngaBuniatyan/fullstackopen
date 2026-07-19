const Country = ({ country }) => {
  const languages = Object.entries(country.languages ?? {})

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital?.join(', ') ?? 'N/A'}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {languages.map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.common}`}
        width="160"
      />
    </div>
  )
}

export default Country
