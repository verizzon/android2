import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './PaymentPage.css'

function PaymentPage({ cart, setCart }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('') // Добавляем состояние для сообщения об успехе
  const navigate = useNavigate()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'))
    if (storedCart) {
      setCart(storedCart)
    }
  }, [setCart])

  const validateCardNumber = (number) => {
    return /^[0-9]{16}$/.test(number) // Только 16 цифр
  }

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/').map(Number)
    if (month < 1 || month > 12) return false // Проверка месяца
    const currentYear = new Date().getFullYear() % 100 // Последние 2 цифры текущего года
    const currentMonth = new Date().getMonth() + 1 // Текущий месяц
    if (year < currentYear || (year === currentYear && month < currentMonth))
      return false // Проверка года и месяца
    if (year < 24) return false // Минимальный год - 2024
    return true
  }

  const validateCvv = (cvv) => {
    return /^[0-9]{3}$/.test(cvv) // Только 3 цифры
  }

  const handlePayment = () => {
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Please enter a 16-digit card number.')
      return
    }

    if (!validateExpiryDate(expiryDate)) {
      setError('Invalid expiry date. Please enter a valid date.')
      return
    }

    if (!validateCvv(cvv)) {
      setError('Invalid CVV. Please enter a 3-digit CVV.')
      return
    }

    console.log('Cart being sent:', cart)

    const token = localStorage.getItem('token')

    axios
      .put(
        'http://localhost:5001/api/products/update-stock',
        { cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        axios
          .post(
            'http://localhost:5001/api/orders',
            { cart },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setSuccessMessage('Payment and order saving successful!')
            setCart([])
            localStorage.removeItem('cart')

            setTimeout(() => {
              navigate('/history') // Перенаправляем на страницу истории заказов через 3 секунды
            }, 3000)
          })
          .catch((error) => {
            console.error('Failed to save the order:', error)
            alert('Payment was successful but failed to save the order.')
          })
      })  
      .catch((error) => {
        console.error('Failed to update stock:', error)
        alert('Payment was successful but failed to update stock.')
      })

    setError('')
  }

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Удаление всех нечисловых символов
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }
    setExpiryDate(value)
  }

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      {successMessage && ( // Отображение push-уведомления
        <div className="success-message">{successMessage}</div>
      )}
      <div className="payment-field">
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maxLength="16"
          placeholder="1234 5678 9012 3456"
        />
      </div>
      <div className="payment-field">
        <label>Expiry Date (MM/YY):</label>
        <input
          type="text"
          value={expiryDate}
          onChange={handleExpiryDateChange}
          maxLength="5"
          placeholder="MM/YY"
        />
      </div>
      <div className="payment-field">
        <label>CVV:</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          maxLength="3"
          placeholder="123"
        />
      </div>
      {error && <p className="payment-error">{error}</p>}
      <button className="payment-button" onClick={handlePayment}>
        Pay
      </button>
    </div>
  )
}

export default PaymentPage
