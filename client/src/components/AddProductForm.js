import React, { useState } from 'react'
import axios from 'axios'

function AddProductForm() {
  const [product, setProduct] = useState({
    name: '',
    photo: '',
    year: '',
    country: '',
    price: '',
    stock: '', // Добавляем поле для количества на складе
  })

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5001/api/products',
        product
      )
      console.log(response.data)
      // Очистить форму или действия после отправки формы
      setProduct({
        name: '',
        photo: '',
        year: '',
        country: '',
        price: '',
        stock: '', // Очистка поля stock
      })
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="photo"
        value={product.photo}
        onChange={handleChange}
        placeholder="Photo URL"
        required
      />
      <input
        type="number"
        name="year"
        value={product.year}
        onChange={handleChange}
        placeholder="Year of Manufacture"
        required
      />
      <input
        type="text"
        name="country"
        value={product.country}
        onChange={handleChange}
        placeholder="Country of Manufacture"
        required
      />
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="number"
        name="stock"
        value={product.stock}
        onChange={handleChange}
        placeholder="Stock Quantity"
        required
      />
      <button type="submit">Add Product</button>
    </form>
  )
}

export default AddProductForm
