import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // Импортируем useNavigate
import './LoginPage.css' // Подключаем CSS стили

function LoginPage({ setToken, setUserRole }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate() // Создаем экземпляр useNavigate

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5001/api/users/login',
        { username, password }
      )

      const { token, role } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUserRole(role)

      // Извлечение роли пользователя из JWT
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      setUserRole(decodedToken.role)

      // Удаляем сообщение об успешном входе
      // alert('Login successful!')

      navigate('/') // Перенаправляем пользователя на главную страницу после успешного входа
    } catch (error) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginPage
