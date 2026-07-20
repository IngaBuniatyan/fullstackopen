import { create } from 'zustand'

let timer

export const useNotificationStore = create((set) => ({
  message: '',
  notify: (message) => {
    window.clearTimeout(timer)
    set({ message })
    timer = window.setTimeout(() => set({ message: '' }), 5000)
  },
}))
