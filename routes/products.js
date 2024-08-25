const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const router = express.Router()
const { checkRole } = require('./users')

// Обновление запаса продуктов должно быть первым в списке, чтобы избежать конфликта с параметрами ':id'
router.put('/update-stock', async (req, res) => {
  const { cart } = req.body

  // Проверка наличия корзины и корректности ее структуры
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Invalid cart data' })
  }

  try {
    for (const item of cart) {
      console.log(
        `Processing product ID: ${item._id} with quantity: ${item.quantity}`
      )

      // Проверка наличия item._id и item.quantity
      if (
        !item._id ||
        typeof item.quantity !== 'number' ||
        item.quantity <= 0
      ) {
        return res
          .status(400)
          .json({ message: `Invalid data for product ${item._id}` })
      }

      const product = await Product.findById(item._id)
      if (!product) {
        return res
          .status(404)
          .json({ message: 'Product not found', id: item._id })
      }

      console.log(
        `Types - product.stock: ${typeof product.stock}, item.quantity: ${typeof item.quantity}`
      )
      console.log(
        `Values - product.stock: ${product.stock}, item.quantity: ${item.quantity}`
      )

      // Проверка наличия достаточного количества товара
      if (product.stock < item.quantity) {
        return res
          .status(409)
          .json({ message: 'Insufficient stock', id: item._id })
      }
      if (
        !item.quantity ||
        typeof item.quantity !== 'number' ||
        isNaN(item.quantity)
      ) {
        return res
          .status(400)
          .json({ message: `Invalid quantity for product ${item._id}` })
      }

      // Обновление количества на складе
      product.stock -= item.quantity
      await product.save()
      console.log(`Stock updated for product ID: ${item._id}`)
    }

    res.json({ message: 'Stock updated successfully' })
  } catch (err) {
    console.error('Error updating stock:', err.message)
    res
      .status(500)
      .json({ message: 'Error updating stock', error: err.message })
  }
})

// Остальные маршруты
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid ID format')
  }
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).send('Product not found')
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', checkRole('admin'), async (req, res) => {
  const { name, photo, country, price, stock } = req.body
  const product = new Product({ name, photo, country, price, stock })
  try {
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.patch('/:id', checkRole('admin'), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid ID format')
  }
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send('Product not found')
    if (req.body.name) product.name = req.body.name
    if (req.body.photo) product.photo = req.body.photo
    if (req.body.country) product.country = req.body.country
    if (req.body.price) product.price = req.body.price
    if (req.body.stock) product.stock = req.body.stock
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:name', checkRole('admin'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ name: req.params.name })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
