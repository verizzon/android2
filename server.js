const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Product = require('./models/Product')
const Order = require('./models/Order')

const app = express()

// Подключение моделей и маршрутов
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/users')
const productRoutes = require('./routes/products')

// Middleware
app.use(bodyParser.json())
app.use(cors())

// MongoDB connection
const dbUri = 'mongodb://localhost:27017/myecommercedb'
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Создание администратора при запуске сервера
const createAdminUser = async () => {
  const adminExists = await User.findOne({ username: 'admin' })
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin', 10)
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    })
    await adminUser.save()
    console.log(
      'Admin user created with username "admin" and password "admin".'
    )
  }
}

createAdminUser()

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  jwt.verify(token, process.env.JWT_SECRET || 'lambo220', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' })
    console.log('User decoded from token:', user) // Логирование пользователя
    req.user = user
    next()
  })
}

// Middleware для проверки роли
const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

// Route to update the stock after payment
app.put('/api/products/update-stock', authenticateToken, async (req, res) => {
  const { cart } = req.body
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Cart data is missing or invalid' })
  }

  let errorOccurred = false
  let errorMessages = []

  console.log('Cart processing started')
  for (const item of cart) {
    console.log(`Attempting to find and update product ID: ${item._id}`)
    try {
      const product = await Product.findById(item._id)
      if (!product) {
        console.log(`Product with ID ${item._id} not found`)
        errorMessages.push(`Product with ID ${item._id} not found`)
        errorOccurred = true
        continue
      }

      if (product.stock < item.quantity) {
        console.log(`Not enough stock for ${product.name}`)
        errorMessages.push(`Not enough stock for ${product.name}`)
        errorOccurred = true
        continue
      }

      product.stock -= item.quantity
      await product.save()
      console.log(`Stock updated for product ID: ${item._id}`)
    } catch (err) {
      console.error('Error during stock update:', err)
      errorMessages.push(`Error updating product ${item._id}: ${err.message}`)
      errorOccurred = true
    }
  }

  if (errorOccurred) {
    console.log('Errors occurred:', errorMessages)
    res.status(500).json({
      message: 'Failed to update some items in the cart',
      errors: errorMessages,
    })
  } else {
    console.log('All items in cart processed successfully')
    res.status(200).json({ message: 'Stock updated successfully' })
  }
})

// Route to save order after successful payment
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { cart } = req.body

  try {
    const order = new Order({
      user: req.user.id,
      products: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      date: new Date(),
    })

    await order.save()
    res.status(201).json({ message: 'Order saved successfully.' })
  } catch (error) {
    console.error('Error saving order:', error)
    res
      .status(500)
      .json({ message: 'Failed to save order.', error: error.message })
  }
})

// Route to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    console.error('Error getting products:', err)
    res.status(500).json({ message: 'Server error', error: err })
  }
})

// Route to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).send('Product not found')
    }
  } catch (err) {
    console.error('Error getting product by ID:', err)
    res.status(500).json({ message: 'Server error', error: err })
  }
})

// Route to add a new product
app.post(
  '/api/products',
  authenticateToken,
  checkRole('admin'),
  async (req, res) => {
    try {
      console.log('Product data received:', req.body)
      const { name, photo, year, country, price, stock } = req.body
      const newProduct = new Product({
        name,
        photo,
        year,
        country,
        price,
        stock,
      })
      const savedProduct = await newProduct.save()
      console.log('Product saved successfully:', savedProduct)
      res.json(savedProduct)
    } catch (err) {
      console.error('Error saving product:', err)
      res.status(500).json({ message: 'Server error', error: err })
    }
  }
)

// Route to update a product
app.put(
  '/api/products/:id',
  authenticateToken,
  checkRole('admin'),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      console.log('Product updated successfully:', updatedProduct)
      res.json(updatedProduct)
    } catch (err) {
      console.error('Error updating product:', err)
      res.status(500).json({ message: 'Server error', error: err })
    }
  }
)

// Route to delete a product
app.delete(
  '/api/products/:id',
  authenticateToken,
  checkRole('admin'),
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id)
      console.log(`Product with ID ${req.params.id} deleted`)
      res.json({ message: 'Product deleted' })
    } catch (err) {
      console.error('Error deleting product:', err)
      res.status(500).json({ message: 'Server error', error: err })
    }
  }
)

// Route to delete all products (for admin)
app.delete(
  '/api/products',
  authenticateToken,
  checkRole('admin'),
  async (req, res) => {
    try {
      await Product.deleteMany({})
      res.status(200).send('All products deleted.')
    } catch (error) {
      res.status(500).send('Error deleting products.')
    }
  }
)

// Подключение маршрутов пользователей и заказов
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Define port
const PORT = process.env.PORT || 5001

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
