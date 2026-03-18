const express = require('express')
const router = express.Router()

router.route('/register')
    .post(require('../Controllers/authController').register)
router.route('/login')
    .post(require('../Controllers/authController').login)

module.exports = router