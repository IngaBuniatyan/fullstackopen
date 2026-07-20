import {
  createContext,
  useContext,
  useReducer,
  useRef,
} from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    null,
  )

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () =>
  useContext(NotificationContext)[0]

export const useNotify = () => {
  const dispatch = useContext(NotificationContext)[1]
  const timer = useRef()

  return (message, type = 'success') => {
    window.clearTimeout(timer.current)
    dispatch({ type: 'SET', payload: { message, type } })
    timer.current = window.setTimeout(
      () => dispatch({ type: 'CLEAR' }),
      5000,
    )
  }
}
