const userSchema = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const checkEmail = await userSchema.findOne({ email })
        const checkUsername = await userSchema.findOne({ username })
        if (checkEmail) {
            return res.json({ message: "This email is already registered", status: false })
        }
        if (checkUsername) {
            return res.json({ message: "This username is already registered", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            username,
            password: hashedPassword,
            email
        }
        const user = await userSchema.create(newUser)
        delete user.password
        res.status(201).json({ user, status: true })
    } catch (error) {
        res.status(401).json({ message: `${error.message}`, status: "error" })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userSchema.findOne({ username })
        if (!user) {
            return res.json({ message: "user not found", status: false })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.json({ message: "Invalid Password", status: false })
        }
        const token = jwt.sign({ "username": user.username }, process.env.JWT_SECRET, { expiresIn: '30m' })
        const userObject = user.toObject()
        delete userObject.password;
        userObject.token = token;
        res.status(201).json({ user: userObject, status: true })
    } catch (error) {
        res.status(401).json({ message: `${error.message}`, status: false })
    }
}
module.exports = { register, login }