import React, { useState } from 'react'
import axios from 'axios'
import './RegisterPage.css' // Стили для страницы регистрации

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5001/api/users/register', {
        username,
        password,
        role: 'user',
      })
      alert('Registration successful! You can now login.')
    } catch (error) {
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="register-error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegisterPage
