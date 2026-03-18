const express = require('express')
const router = express.Router()

router.route('/')
    .post(require('../Middlewares/jwtVerify'),require('../Controllers/messageController').newMessage)

router.route('/inbox')
    .post(require('../Middlewares/jwtVerify'),require('../Controllers/messageController').getAllMessages)

module.exports = router