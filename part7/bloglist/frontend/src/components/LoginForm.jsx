import { Navigate, useNavigate } from 'react-router-dom'

import useField from '../hooks/useField'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'

const LoginForm = () => {
  const username = useField()
  const password = useField('password')
  const user = useUserStore((state) => state.user)
  const login = useUserStore((state) => state.login)
  const notify = useNotificationStore((state) => state.notify)
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login({
        username: username.value,
        password: password.value,
      })
      navigate('/')
    } catch {
      notify('Wrong username or password', 'error')
    }
  }

  return (
    <section className="auth-card">
      <h1>Log in to Bloglist</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            aria-label="username"
            autoComplete="username"
            {...username.input}
          />
        </label>
        <label>
          Password
          <input
            aria-label="password"
            autoComplete="current-password"
            {...password.input}
          />
        </label>
        <button className="primary" type="submit">
          login
        </button>
      </form>
    </section>
  )
}

export default LoginForm
