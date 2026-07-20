import { Navigate } from 'react-router-dom'

import useUserStore from '../stores/userStore'

const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user)
  const initialized = useUserStore((state) => state.initialized)

  if (!initialized) {
    return <p>Loading...</p>
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
