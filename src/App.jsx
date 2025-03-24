import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { testConnection } from './services/api'
import Homepage from './pages/HomePage'


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
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex space-x-4">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-blue-400 transition-colors">About Me</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
