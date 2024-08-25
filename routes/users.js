const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

const jwtSecret = 'lambo220' // Убедитесь, что этот секрет безопасен и не хранится в коде

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body

    // Проверка, не существует ли пользователь с таким именем
    const existingUser = await User.findOne({ username })
    if (existingUser)
      return res.status(400).json({ message: 'Username already exists' })

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создание нового пользователя
    const user = new User({ username, password: hashedPassword, role })
    const newUser = await user.save()

    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Вход в систему
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Поиск пользователя
    const user = await User.findOne({ username })
    if (!user)
      return res.status(400).json({ message: 'Invalid username or password' })

    // Сравнение паролей
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid username or password' })

    // Создание JWT
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: '1h',
    })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware для проверки роли
function checkRole(role) {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, jwtSecret)
      if (decoded.role !== role)
        return res.status(403).json({ message: 'Access denied' })

      req.user = decoded
      next()
    } catch (err) {
      res.status(401).json({ message: 'Not authenticated' })
    }
  }
}

module.exports = router // Экспортируем только router
module.exports.checkRole = checkRole // Отдельно экспортируем checkRole
