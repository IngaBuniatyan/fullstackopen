import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Bloglist rendering error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-page" role="alert">
          <h1>Something went wrong</h1>
          <p>
            The page could not be displayed. Use the navigation to continue.
          </p>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
