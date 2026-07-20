import { create } from 'zustand'

import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  initialized: false,

  initializeUser: () => {
    const user = persistentUser.getUser()
    blogService.setToken(user?.token)
    set({ user, initialized: true })
  },

  login: async (credentials) => {
    const user = await loginService.login(credentials)
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
    return user
  },

  logout: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  },
}))

export default useUserStore
