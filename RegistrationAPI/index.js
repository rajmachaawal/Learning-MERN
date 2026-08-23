require("dotenv").config();
const User = require('./Models/user')

const mongoose = require("mongoose");

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected!");

        const user = new User({
            name: "Lucky",
            email: "lucky@example.com",
            age: 20
        });

        try {
            const savedUser = await user.save();
            console.log(`User ${savedUser.name} created successfully!`);
            console.log(`User ID: ${savedUser._id}!`);
        }catch(error) {
            console.error("User Creation Error:", error);
        }

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
}
start();