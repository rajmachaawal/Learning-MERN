require("dotenv").config();
const User = require('./Models/user')
const mongoose = require("mongoose");



//USER CREATING FUNCTION
async function createUser(userName, userEmail, userAge) {
    try {
        const user = newUser({
            name: userName,
            email: userEmail,
            age: userAge
        })
        const savedUser = await user.save();
        console.log(`User ${savedUser.name} created successfully!`);
        console.log(`User ID: ${savedUser._id}!`);
    }catch(error){
        console.error("Error creating user: ", error.message);
    }

}



//ALL USERS FETCHING FUNCTION
async function getUsers() {
    try{
        const users = await User.find();
        console.log("Users:", users);
    }catch(error) {
        console.error("Error fetching users: ", error);
    }
}



//FUNCTIONS FOR FETCHING USER BY EMAIL
async function getUserByEmail(userEmail) {
    try{
        const user = await User.findOne({
            email: userEmail
        })
        if(user !== null) {
            console.log(`User with email -${userEmail} "Found": \n${user.name} \n${user.email} \n${user.age}`);
        }else{
            console.log(`User with email -${userEmail} "Not found".`);
        }
    }catch(error){
        console.error("Error fetching user by email: ", error);
    }
}



//FUNCTION FOR FECHING BY ID
async function getUserById(userId) {
    try{
        const user = await User.findById(userId);
        if(user !== null) {
            console.log(`User with ID -${userId} "Found": \n${user.name} \n${user.email} \n${user.age}`);
        }else{
            console.log(`User with ID -${userId} "Not found".`);
        }
    }catch(error){
        console.error("Error fetching user by ID: ", error.message);
    }
}



//FUNCTION FOR FETCHING WITH AGE FILTER
async function getUserByAge(someAge) {
    try{
        let userNumber = 1;
        const users = await User.find({
            age: {
                $gt: someAge
            }
        });
        if(users.length !== 0) {
            console.log(`Users with age greater than ${someAge}:\n`);
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        } else {
            console.log(`No users found with age greater than ${someAge}`);
        }
    }catch(error) {
        console.error("Error fetching users by age: ", error.message);
    }
}

//MONGODB CONNECTION
async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected!");

        getUserByAge(20);

    } catch (error) {
        return console.error("MongoDB Connection Error:", error);
    }
}
start();