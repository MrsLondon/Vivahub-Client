import { useState, useEffect } from 'react'
import './App.css'
import { testConnection } from './services/api'

function App() {
  const [message, setMessage] = useState('Loading...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await testConnection()
        setMessage(response)
      } catch (err) {
        setError('Failed to connect to backend')
        console.error('Connection error:', err)
      }
    }

    checkBackendConnection()
  }, [])

  return (
    <div className="App">
      <h1>VivaHub</h1>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="message">{message}</div>
      )}
    </div>
  )
}

export default App
