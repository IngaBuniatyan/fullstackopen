const storageKey = 'loggedBloglistUser'

const getUser = () => {
  const storedUser = window.localStorage.getItem(storageKey)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    window.localStorage.removeItem(storageKey)
    return null
  }
}

const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default { getUser, removeUser, saveUser }
