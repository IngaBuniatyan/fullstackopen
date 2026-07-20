import { create } from 'zustand'

let notificationTimer

const useNotificationStore = create((set) => ({
  notification: null,
  notify: (message, type = 'success', seconds = 5) => {
    window.clearTimeout(notificationTimer)
    set({ notification: { message, type } })
    notificationTimer = window.setTimeout(
      () => set({ notification: null }),
      seconds * 1000,
    )
  },
  clearNotification: () => {
    window.clearTimeout(notificationTimer)
    set({ notification: null })
  },
}))

export default useNotificationStore
