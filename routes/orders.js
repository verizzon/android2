const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { checkRole } = require('./users')

// Маршрут для получения истории покупок пользователя
router.get('/history', checkRole('user'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product') // Убедитесь, что 'products.product' это правильный путь
      .exec()

    res.json(
      orders.map((order) => ({
        id: order._id,
        date: order.date,
        products: order.products.map((p) => ({
          id: p.product._id, // Идентификатор продукта
          name: p.product.name, // Имя продукта
          quantity: p.quantity, // Количество продукта
        })),
      }))
    )
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching order history: ' + err.message })
  }
})

module.exports = router
