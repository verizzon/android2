import React, { useState, useEffect } from 'react'
import './Cart.css'

function Cart({ cart, setCart }) {
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'))
    if (storedCart) {
      setCart(storedCart)
    }
  }, [setCart])

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: quantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Сохраняем изменения в локальном хранилище
  }

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Сохраняем изменения в локальном хранилище
  }

  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.photo} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, parseInt(e.target.value))
                  }
                  min="1"
                />
              </p>
              <button onClick={() => handleRemoveFromCart(item._id)}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Cart
