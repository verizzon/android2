import React, { useState } from 'react'
import './ProductPage.css' // Подключаем стили

function ProductPage({ product }) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // Логика добавления товара в корзину
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="product-container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <div className="product-actions">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="quantity-input"
        />
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductPage
