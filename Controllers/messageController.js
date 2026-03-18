const messageSchema = require('../Models/messageModel')

const newMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body
        const data = await messageSchema.create({
            message: message,
            users: [from, to],
            sender: from
        })
        res.status(201).json({ message: "Message added successfully", status: true })
    } catch (error) {
        console.log(error.message)
    }
}
const getAllMessages = async (req, res) => {
    try {
        const { from, to } = req.body
        const data = await messageSchema.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 });
        const messages = data.map((message) => {
            return {
                fromSelf: message.sender.toString() === from,
                message: message.message
            }
        })
        res.json(messages)
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = { newMessage, getAllMessages }