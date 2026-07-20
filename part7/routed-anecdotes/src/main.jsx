import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AnecdotesProvider } from './hooks'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AnecdotesProvider>
      <App />
    </AnecdotesProvider>
  </BrowserRouter>,
)

