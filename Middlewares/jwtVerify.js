const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    try {
        const authHeaders = req.headers['authorization']
        if (!authHeaders) {
            res.sendStatus(401)
        }
        const token = authHeaders.split(' ')[1]
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decode) => {
                if (err) {
                    res.json({ "message": `session ended`, status: false })
                }
                else {
                    next()
                }
            }
        )
    } catch (error) {
        res.status(400).json({ "message": `session ended`, status: false })
    }
}

module.exports = verifyJWT