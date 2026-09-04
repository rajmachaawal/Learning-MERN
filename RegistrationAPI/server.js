import dotenv from "dotenv";
dotenv.config();
import express from "express";
const expApp = express();
import User from "./Models/user.js";
import mongoose from "mongoose";
import { hash } from "ironpass";

//<-----------------------------------------------------------EXPRESS SECTION---------------------------------------------------->

//EXPRESS MIDDLEWARE:
expApp.use(express.json());

//POST ROUTE:
//ALSO AN EXAMPLE OF CLIENT REQUEST VALIDATION:
expApp.post('/api/auth/register', async (req, res) => {



    const {username, firstName, lastName, email, dateOfBirth, password} = req.body;
    
    // let hasMissingFields = true;
    // //TRIMMING OF TRAILING SPACES:
    // const cleanedData = {
    //     username: username?.trim(),
    //     firstName: firstName?.trim(),
    //     lastName: lastName?.trim(),
    //     email: email?.trim(),
    //     dateOfBirth: dateOfBirth?.trim(),
    //     password
    // };

    // const requiredFields = [
        //     "username",
    //     "firstName",
    //     "lastName",
    //     "email",
    //     "dateOfBirth",
    //     "password"
    // ];
    
    
    // //BELOW CODE ALSO VALIDATES FIELDS BUT EVERYTHING IS EXPLICITLY HANDLED:
    // for(const field of requiredFields){
    //     if(!cleanedData[field]){
        //         hasMissingFields = false;
    //         break;
    //     }
    // }
    
    
    // //BELOW IS AN IMPLICIT WAY TO WRITE THE SAME THING AS ABOVE USING .some():
    // hasMissingFields = requiredFields.some(field => !cleanedData[field]);
    
    // if(hasMissingFields){
    //     res.status(400).json({
    //         "message":"User sent bad data",
    //         "status":"Bad Request"
    //     })
    // }else{
    //     res.status(400).json({
    //         "message":"User sent bad data",
    //         "status":"Bad Request"
    //     })
    // }
    
    



    //------------THE ABOVE CODE IS ALSO AN EXAMPLE OF POOR PIPELINIG------------------->
    //------------THE CODE BELOW IS PROPER PIPELINING OF AN SCALABLE VALIDATION LAYER--->
    const stringFields = [
        "username",
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
        "password"
    ];

    const rawData = {username, firstName, lastName, email, dateOfBirth, password};
    
    //FUNCTION VALIDATING DATATYPE OF EACH FIELD:
    const stringValidator = (stringFields, rawData) => {
        let hasOtherTypeFields = stringFields.some((field) => {return typeof rawData[field] !== "string"});
        return hasOtherTypeFields;
    };
    if(stringValidator(stringFields, rawData)){
        res.status(400).json({
            "message":"User sent bad data",
            "status":"Bad Request"
        })
    }else{
        const requiredFields = [
            "username",
            "firstName",
            "lastName",
            "email",
            "dateOfBirth",
            "password"
        ];
        //DATA CLEANING:
        const cleanedData = {
            username: username?.trim(),
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            email: email?.trim(),
            dateOfBirth: dateOfBirth?.trim(),
            password
        };  

        //FUNCTION VALIDATING MISSING FIELDS:
        const missingFieldsValidator = (requiredFields, cleanedData) => {
            let hasMissingFields = requiredFields.some((field) => {return !cleanedData[field]});
            return hasMissingFields;
        }

        if(missingFieldsValidator(requiredFields, cleanedData)){
            res.status(400).json({
                "message":"User sent bad data",
                "status":"Bad Request"
            }) 
            res.end();
        }else{
            //FORMAT VALIDATION AND ERROR COLLECTION:
            const errors = [];
            const errorTypes = {
                username:"Invalid Username Format",
                firstName:"Invalid First Name",
                lastName:"Invalid Last Name",
                email:"Invalid Email Format",
                dateOfBirth:"Invalid Date Format",
                password:"Invalid Password Format"
            }
            const formatRules = {
                username:/^[A-Za-z][A-Za-z0-9_]{2,19}$/,
                firstName: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
                lastName: /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
                email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
                password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,64}$/
            }

            //THIS IS ITERATION OVER OBJECT's PROPERTIES:
            for(const [field, rule] of Object.entries(formatRules)){
               if(!rule.test(cleanedData[field].trim())){
                errors.push(errorTypes[field]);
               } 
            }

            if(errors.length > 0){
                res.status(400).json({
                    message: "Validation Failed",
                    status: "Bad Request",
                    errors: `${errors}`
                })
                res.end();
            }else{
                try{
                    //BUSINESS LOGICS:

                    //BUSINESS LOGIC 1. - UNIQUENESS!
                    //BELOW GIVEN IS A FUNCTION THAT CHECKS IF USERNAME OR EMAIL ALREADY EXISTS IN THE DATABASE:
                    async function findExistingUser(username,email){
                        const existingUser = await User.findOne({
                            $or: [
                                {username: username},
                                {email: email}
                            ]
                        })
                        return existingUser;
                    }
                    if(await findExistingUser(cleanedData.username,cleanedData.email)){
                        res.status(409).json({
                            "message":"Username or email already exists",
                            "status":"Conflict"
                        });
                        res.end();
                    }else{

                        //BUSINESS LOGIC 2. - DATE OF BIRTH/AGE VALIDATION:
                        //BELOW FUNCTION CHECKS IF DATE IS VALID:
                        function isValidDate(dateOfBirth){
                            const date = new Date(dateOfBirth);
                            const [year, month, day] =  dateOfBirth.split('-').map(Number);
                            return date.getFullYear() === year && date.getMonth() === month-1 && date.getDate() === day;
                        }
                        if(!isValidDate(cleanedData.dateOfBirth)){
                            res.status(400).json({
                                "message":"Enter Date is Invalid",
                                "status":"Bad Request"
                            })
                            res.end();
                        }else{

                            //BUSINESS LOGIC 3. - PASSWORD HASHING:
                            const passwordHash = await hash(cleanedData.password);

                            //BUSINESS LOGIC 4. - USER CREATION:
                            const newUser = await createUser(cleanedData, passwordHash);
                            res.status(201).json({
                                message: "Account created successfully. Please proceed to login."
                            });
                            res.end();
                        }
                    }
                }catch(error){
                    console.error(error);
                    res.status(500).json({
                        message: "Something went wrong",
                        status: "Internal Server Error"
                    });
                }

            }

          

        }
    }

});




//<------------------------------------------------MONGODB SECTION------------------------------------------------------------->


//USER CREATING FUNCTION
async function createUser(cleanedData,passwordHash) {
    const user = new User({
        username: cleanedData.username,
        firstName: cleanedData.firstName,
        lastName: cleanedData.lastName,
        email: cleanedData.email,
        dateOfBirth: cleanedData.dateOfBirth,
        passwordHash: passwordHash
    })
    const savedUser = await user.save();
    return savedUser;

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
            console.log(`User with email -${userEmail} "Found": \n${user.username} \n${user.email} \n${user.age}`);
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


//<--------------------------------------------------------SERVER INITIATION SECTION---------------------------------------------->


//MONGODB CONNECTION
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");

        expApp.listen(4001,() => {
            console.log("Server running on port 4001")
        })

    } catch (error) {
        await mongoose.disconnect(process.env.MONGODB_URI);
        console.log("MongoDB disconnected due to server start failure.");
        return console.error("Failed to start server:", error.message);
    }
}
startServer();