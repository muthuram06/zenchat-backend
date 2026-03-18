const express = require('express')
const router = express.Router()

router.route('/avatar/:id')
    .put(require('../Middlewares/jwtVerify'),require('../Controllers/userController').updateAvatar)
    
router.route('/:id')
    .get(require('../Middlewares/jwtVerify'),require('../Controllers/userController').getAllContacts)

module.exports = router