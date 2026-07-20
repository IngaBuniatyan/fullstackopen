import { Link, Route, Routes } from 'react-router-dom'

import AnecdoteList from './components/AnecdoteList'
import AnecdoteView from './components/AnecdoteView'
import CreateNew from './components/CreateNew'

const About = () => (
  <section>
    <h2>About anecdote app</h2>
    <p>
      According to Wikipedia, software engineering anecdotes are short
      humorous or interesting stories about software development.
    </p>
  </section>
)

const Footer = () => (
  <footer>
    Anecdote app for{' '}
    <a href="https://fullstackopen.com">Full Stack Open</a>
  </footer>
)

const App = () => (
  <div className="app">
    <header>
      <h1>Software anecdotes</h1>
      <nav>
        <Link to="/">anecdotes</Link>
        <Link to="/create">create new</Link>
        <Link to="/about">about</Link>
      </nav>
    </header>

    <main>
      <Routes>
        <Route path="/" element={<AnecdoteList />} />
        <Route path="/anecdotes/:id" element={<AnecdoteView />} />
        <Route path="/create" element={<CreateNew />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </main>

    <Footer />
  </div>
)

export default App

