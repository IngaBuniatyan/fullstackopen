import { useEffect, useRef, useState } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeout = useRef(null)

  const showNotification = (message, type) => {
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current)
    }

    setNotification({ message, type })
    notificationTimeout.current = window.setTimeout(() => {
      setNotification(null)
      notificationTimeout.current = null
    }, 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch(() => {
        showNotification('Failed to load phonebook data', 'error')
      })

    return () => {
      if (notificationTimeout.current) {
        window.clearTimeout(notificationTimeout.current)
      }
    }
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    )

    if (existingPerson) {
      const replaceNumber = window.confirm(
        `${name} is already added to phonebook, replace the old number with a new one?`,
      )

      if (!replaceNumber) {
        return
      }

      const updatedPerson = { ...existingPerson, number }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((currentPersons) =>
            currentPersons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person,
            ),
          )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`, 'success')
        })
        .catch((error) => {
          const noLongerExists = error.response?.status === 404
          const validationError = error.response?.data?.error
          const message = noLongerExists
            ? `Information of ${name} has already been removed from server`
            : validationError || `Failed to update ${name}`

          if (noLongerExists) {
            setPersons((currentPersons) =>
              currentPersons.filter(
                (person) => person.id !== existingPerson.id,
              ),
            )
          }

          showNotification(message, 'error')
        })
      return
    }

    const person = { name, number }

    personService
      .create(person)
      .then((returnedPerson) => {
        setPersons((currentPersons) => currentPersons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`, 'success')
      })
      .catch((error) => {
        const message =
          error.response?.data?.error || `Failed to add ${name}`
        showNotification(message, 'error')
      })
  }

  const deletePerson = (person) => {
    const confirmed = window.confirm(`Delete ${person.name}?`)

    if (!confirmed) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons((currentPersons) =>
          currentPersons.filter(
            (currentPerson) => currentPerson.id !== person.id,
          ),
        )
      })
      .catch((error) => {
        const noLongerExists = error.response?.status === 404
        const message = noLongerExists
          ? `Information of ${person.name} has already been removed from server`
          : `Failed to delete ${person.name}`

        if (noLongerExists) {
          setPersons((currentPersons) =>
            currentPersons.filter(
              (currentPerson) => currentPerson.id !== person.id,
            ),
          )
        }

        showNotification(message, 'error')
      })
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

  const visiblePersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={visiblePersons} onDelete={deletePerson} />
    </div>
  )
}

export default App
