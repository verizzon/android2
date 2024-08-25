import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Product from '../components/Product'
import './HomePage.css'

function HomePage({ addToCart }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Проверяем, авторизован ли пользователь (есть ли токен в localStorage)
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }

    console.log('Is authenticated:', isAuthenticated) // Проверка состояния

    axios
      .get('http://localhost:5001/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
  }, [isAuthenticated]) // Добавляем зависимость от isAuthenticated

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      const updatedProduct = { ...product, quantity: 1 } // Добавляем поле quantity
      addToCart(updatedProduct)
      setProducts(
        products.map((p) =>
          p._id === product._id ? { ...p, stock: p.stock - 1 } : p
        )
      )
    } else {
      alert('This product is out of stock')
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.country?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search for products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <Product
            key={product._id}
            product={product}
            addToCart={handleAddToCart}
            isAuthenticated={isAuthenticated} // передаем информацию об авторизации
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage
