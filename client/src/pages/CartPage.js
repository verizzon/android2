import React from 'react'
import { Link } from 'react-router-dom'
import './CartPage.css' // Подключаем созданный CSS файл

function CartPage({ cart, removeFromCart }) {
  // Функция для вычисления общей суммы товаров в корзине с учетом количества
  const getTotalPrice = () => {
    return cart
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2)
  }

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">
          Your cart is empty. <Link to="/">Go shopping!</Link>
        </p>
      ) : (
        <div>
          <ul className="cart-list">
            {cart.map((product) => (
              <li key={product._id} className="cart-item">
                {product.name} - ${product.price} x {product.quantity}
                <button onClick={() => removeFromCart(product._id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total:</strong> ${getTotalPrice()}
          </div>
          <Link to="/payment" className="proceed-to-payment">
            Proceed to Payment
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartPage
