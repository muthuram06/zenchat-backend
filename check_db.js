const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/zenChat/zenChat-backend-main/.env' });
const userSchema = require('c:/zenChat/zenChat-backend-main/Models/userModel');

async function check() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected');
        const users = await userSchema.find({});
        console.log('Users:', users.map(u => ({ username: u.username, id: u._id, hasAvatar: !!u.AvatarImage })));

        if (users.length < 2) {
            console.log("Not enough users. Creating a bot user...");
            await userSchema.create({
                username: "ChatBot",
                email: "bot@zenchat.com",
                password: "hashedpassword123", // dummy
                isAvatarImage: true,
                AvatarImage: "https://api.dicebear.com/7.x/bottts/svg?seed=chatbot"
            });
            console.log("Bot created.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
