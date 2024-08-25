import React from 'react'
import './Product.css'

function Product({ product, addToCart, isAuthenticated }) {
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to add items to the cart.')
      return
    }
    addToCart(product)
  }

  return (
    <div className="product-item">
      <img src={product.photo} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.country}</p>
      <p>Price: ${product.price}</p>
      <p>In Stock: {product.stock}</p>
      <button
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={!isAuthenticated} // Деактивация кнопки для неавторизованных пользователей
      >
        Add to Cart
      </button>
    </div>
  )
}

export default Product
