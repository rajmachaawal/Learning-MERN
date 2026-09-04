require("dotenv").config();
const User = require('./Models/user')
const mongoose = require("mongoose");


//<---------------------------------------------------MONGODB SECTION------------------------------------------------------------->


//USER CREATING FUNCTION
async function createUser(userName, userEmail, userAge) {
    try {
        const user = new User({
            name: userName,
            email: userEmail,
            age: userAge
        })
        const savedUser = await user.save();
        console.log(`User ${savedUser.name} created successfully!`);
        console.log(`User ID: ${savedUser._id}!`);
    }catch(error){
        console.error("Error creating user: ", error);
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



//FUNCTION FOR RETURNING USERS BETWEEN A RANGE
async function getUsersByAgeRange(minAge, maxAge) {
    try{
        const users =  await User.find({
            age: {
                $gte: minAge,
                $lte: maxAge
            }
        })
        console.log(`Users with age between ${minAge} and ${maxAge}:`);
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        } else {
            console.log(`No users found with age between ${minAge} and ${maxAge}`);
        }
    }catch(error) {
        console.error("Error fetching users by age range: ", error.message);
    }
}



//FUNCTION FOR GETTING USERS BY AGE GROUPS:
async function getUsersByAgeGroups(age1, age2) {
    try{
        const users = await User.find({
            $or: [
                {age: {$lt: age1}},
                {age: {$gt: age2}}
            ]
        });
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        } else {
            console.log(`No users found from age groups less than ${age1} and greater than ${age2}`);
        }
    }catch(error) {
        console.error("Error fetching users by age groups: ", error.message);
    }
}



//FUNCTION FOR GETTING USERS OF SPECIFIC AGE GROUPS: 
async function getUsersOfSpecificAges(ages) {
    try{
        const users = await User.find({
            age:{
                $in: ages
            }
        })
        if(users.length !== 0){
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber} : \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        }else{
            console.log(`No users found with ages ${age1}, ${age2}, ${age3}`);
        }
    }catch(error) {
        console.error("Error fetching users of specific age groups: ", error.message);
    }
}


//FUNCTION RETURNING USERS WITH SPECIFIC AGE AND NAME 
async function getUsersByAgeAndName(someAge, someName) {
    try{
        const users = await User.find({
            $and: [
                {age: {$gt: someAge}},
                {name: someName}
            ]
        })
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        }else{
            console.log(`No users found with age greater than ${someAge} and name ${someName}`);
        }
    }catch(error) {
        console.error("Error fetching users by age and name: ",error.message);
    }
}



//FUNCTION RETURNING USERS NOT BELONGING FROM SPECIFIC AGE!
async function getUsersNotAboveAge(someAge) {
    try{
        const users = await User.find({
            age: {
                $not: {
                    $gt: someAge
                }
            }
        })
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        }else{
            console.log(`No users found with age not greater than ${someAge}!`);
        }
    }catch(error) {
        console.error("Error fetching users by age: ",error.message);
    }
}



//FUNCTION RETURNING USERS FROM A AGE RANGE:
async function getUsersWithinAgeRange(age1, age2) {
    try{
        const users = await User.find({
            $nor: [
                {age: { $lt: age1}},
                {age: { $gt: age2}}
            ]
        })
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        }else{
            console.log(`No users found within range of age ${age1} to ${age2}!`);
        }
    }catch(error) {
        console.error("Error fetching users within age range: ",error.message);
    }
}




//FUNCTION RETURNING USERS NOT FROM A SPECIFIC AGE!
async function getUsersNotOfSpecificAges(ages) {
    try{
        const users = await User.find({
            age:{
                $nin: ages
            }
        })
        if(users.length !== 0) {
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }
        }else{
            console.log(`No users found from ages apart from ${ages}`);
        }       
    }catch(error) {
        console.log(`Error finding users: `,error.message);
    }
}





//FUNCTION FINDING USERS THAT DONT HAVE AGE FIELD:
async function getUsersWithoutAge() {
    try{
        const users = await User.find({
            age:{
                $exists: false
            }
        })
        if(users.length!==0){
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }        
        }else{
            console.log(`No users found without an age field!`);
        }
    }catch(error) {
        console.error(`Error finding users: `,error)
    }
}




//FUNCTION RETURNING BASED ON REGEX:
// "^a"        starts with a
// "a$"        ends with a
// "a"         contains a
// "^a.*n$"    starts with a and ends with n
async function getUsersByRegex(regex,caseSensitivity) {
    try{
        const users = await User.find({
            name:{
                $regex: regex,
                $options: caseSensitivity
            }
        })
        if(users.length!==0){
            let userNumber = 1;
            for(const user of users) {
                console.log(`User ${userNumber}: \n ${user.name} \n ${user.email} \n ${user.age}\n`);
                userNumber++;
            }        
        }else{
            console.log(`No users found starting with ${regex} or ${regex.charAt(0).toUpperCase()}`);
        }
    }catch(error){
        console.error(`Error finding users: `,error.message)
    }
}

//CAUTION: FUNCTION FOR DELETING ALL USERS
async function resetUserCollection() {
    try {
        await User.collection.drop();
        console.log("User collection dropped successfully.");
    } catch (error) {
        console.error("Error dropping user collection:", error.message);
    }
}


//DATABASE SAMPLE POPULATION FUNCTION:
async function populateSampleUsers() {
    try {
        const sampleUsers = [
            {
                username: "lucky_20",
                firstName: "Lucky",
                lastName: "Sharma",
                email: "lucky.sharma@example.com",
                dateOfBirth: "2005-03-12",
                passwordHash: "sample_hash_lucky"
            },
            {
                username: "rajma_dev",
                firstName: "Rajma",
                lastName: "Verma",
                email: "rajma.verma@example.com",
                dateOfBirth: "2004-07-25",
                passwordHash: "sample_hash_rajma"
            },
            {
                username: "kabir_25",
                firstName: "Kabir",
                lastName: "Singh",
                email: "kabir.singh@example.com",
                dateOfBirth: "2001-11-08",
                passwordHash: "sample_hash_kabir"
            },
            {
                username: "ananya30",
                firstName: "Ananya",
                lastName: "Mehta",
                email: "ananya.mehta@example.com",
                dateOfBirth: "1996-05-19",
                passwordHash: "sample_hash_ananya"
            },
            {
                username: "rohan_dev",
                firstName: "Rohan",
                lastName: "Yadav",
                email: "rohan.yadav@example.com",
                dateOfBirth: "2003-09-30",
                passwordHash: "sample_hash_rohan"
            }
        ];

        

        console.log("Sample users inserted successfully.");
    } catch (error) {
        console.error("Error populating users:", error.message);
    }
}


//MONGODB CONNECTION
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");
        

    } catch (error) {
        return console.error("Failed to start server:", error.message);
    }
}
startServer();