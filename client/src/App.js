import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import PaymentPage from './pages/PaymentPage'
import ProductPage from './pages/ProductPage'
import AddProductForm from './components/AddProductForm'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import RegisterPage from './pages/RegisterPage'
import PurchaseHistoryPage from './pages/PurchaseHistoryPage'

import NavBar from './components/NavBar'

function App() {
  const [cart, setCart] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '')
  const isAuthenticated = !!token

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    setUserRole(localStorage.getItem('role') || '')
  }, [])

  const addToCart = (product) => {
    const updatedCart = [...cart]
    const foundItem = updatedCart.find((item) => item._id === product._id)

    if (foundItem) {
      foundItem.quantity += 1
    } else {
      updatedCart.push({ ...product, quantity: 1 })
    }

    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((product) => product._id !== productId))
  }

  const handleLogout = () => {
    setToken('')
    setUserRole('')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.reload()
  }

  return (
    <Router>
      <div>
        <NavBar
          cartCount={cart.length}
          userRole={userRole}
          isLoggedIn={isAuthenticated}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route
            path="/add-product"
            element={<AddProductForm token={token} />}
          />
          <Route path="/history" element={<PurchaseHistoryPage />} />
          <Route
            path="/cart"
            element={<CartPage cart={cart} removeFromCart={removeFromCart} />}
          />
          <Route
            path="/payment"
            element={<PaymentPage cart={cart} setCart={setCart} />}
          />
          <Route path="/product" element={<ProductPage />} />
          <Route
            path="/login"
            element={
              <LoginPage setToken={setToken} setUserRole={setUserRole} />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          {userRole === 'admin' && (
            <Route path="/admin" element={<AdminPage />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
