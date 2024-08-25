import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './PurchaseHistory.css' // Подключаем CSS файл

function PurchaseHistory() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You are not logged in.')
      return
    }

    axios
      .get('http://localhost:5001/api/orders/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Order data received:', response.data)
        setOrders(response.data)
      })
      .catch((error) => {
        console.error('Error fetching order history:', error)
        setError('Failed to fetch order history. Please try again later.')
      })
  }, [])

  return (
    <div className="history-container">
      <h1>Order History</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          {' '}
          {/* Добавляем класс для стилизации */}
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
          </p>
          <div>
            <h3>Products:</h3>
            <ul>
              {order.products.map((product, index) => (
                <li key={`${order.id}-${index}`}>
                  {' '}
                  {/* Уникальный ключ */}
                  {product.name} - {product.quantity} pcs
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PurchaseHistory
