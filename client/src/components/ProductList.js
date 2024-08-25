import React, { useState, useEffect } from 'react'
import Product from './Product'
import axios from 'axios'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/products')
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => console.error('Error fetching products', error))
  }, [])

  const handleAddToCart = (product) => {
    const updatedCart = [...cart]
    const foundItem = updatedCart.find((item) => item._id === product._id)

    if (foundItem) {
      foundItem.quantity += 1 // Увеличиваем количество в корзине
    } else {
      updatedCart.push({ ...product, quantity: 1 }) // Добавляем товар в корзину
    }

    // Обновляем количество товара на складе
    const updatedProducts = products.map((p) =>
      p._id === product._id ? { ...p, stock: p.stock - 1 } : p
    )
    setProducts(updatedProducts) // Сохраняем обновленный список продуктов

    setCart(updatedCart) // Обновляем корзину
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Сохраняем корзину в localStorage

    console.log(
      `Product ${product.name} added to cart. Remaining stock: ${
        product.stock - 1
      }`
    )
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <input type="text" placeholder="Search..." onChange={handleSearch} />
      <div className="product-list">
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <Product
              key={product._id}
              product={product}
              addToCart={() => handleAddToCart(product)}
            />
          ))}
      </div>
    </div>
  )
}

export default ProductList
