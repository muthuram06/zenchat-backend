const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAvatarImage: {
        type: Boolean,
        default :false
    },
    AvatarImage: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('user',userSchema)