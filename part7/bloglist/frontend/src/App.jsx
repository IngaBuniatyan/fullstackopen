import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import CreateBlogView from './components/CreateBlogView'
import ErrorBoundary from './components/ErrorBoundary'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import NotFound from './components/NotFound'
import Notification from './components/Notification'
import ProtectedRoute from './components/ProtectedRoute'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import useBlogStore from './stores/blogStore'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'

const Private = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

const App = () => {
  const location = useLocation()
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const initializeUsers = useBlogStore((state) => state.initializeUsers)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const notify = useNotificationStore((state) => state.notify)

  useEffect(() => {
    initializeUser()
    Promise.all([initializeBlogs(), initializeUsers()]).catch(() => {
      notify('Failed to load Bloglist data', 'error')
    })
  }, [initializeBlogs, initializeUser, initializeUsers, notify])

  return (
    <>
      <Navigation />
      <div className="app-shell">
        <Notification />
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
              element={
                <Private>
                  <BlogList />
                </Private>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <Private>
                  <BlogView />
                </Private>
              }
            />
            <Route
              path="/create"
              element={
                <Private>
                  <CreateBlogView />
                </Private>
              }
            />
            <Route
              path="/users"
              element={
                <Private>
                  <UsersView />
                </Private>
              }
            />
            <Route
              path="/users/:id"
              element={
                <Private>
                  <UserView />
                </Private>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  )
}

export default App
