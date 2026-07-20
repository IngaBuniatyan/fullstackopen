import { NavLink, useNavigate } from 'react-router-dom'

import useUserStore from '../stores/userStore'

const Navigation = () => {
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav aria-label="Main navigation">
      <div className="nav-links">
        <NavLink to="/">blogs</NavLink>
        <NavLink to="/users">users</NavLink>
        <NavLink to="/create">create</NavLink>
      </div>
      <div className="session">
        <span>{user.name || user.username} logged in</span>
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </div>
    </nav>
  )
}

export default Navigation
