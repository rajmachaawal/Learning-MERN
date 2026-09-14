import mongoose from 'mongoose';
import http from "http"
import express from 'express';
const expApp = express();
import dotenv from 'dotenv';
import {hash} from "ironpass";
dotenv.config()
import {fieldsAreStringType, haveRequiredFields, formatValidator, checkRoomExpiry} from './validation.js'
import { findExistingUser, uniqueRoomGenerator, createRoom, getExpiryTime, getRoomId, findRequestedRoom, deleteRoom } from './mongodb.js'
import {Room, User} from './Models/room.model.js'
import { verifyPassword } from "ironpass";
import {createAccessToken, verifyAccessToken, getJwtSecret, alg} from './jwt.js'
import { authMiddleware } from './Middlewares/authMiddleware.js';
import { WebSocketServer } from 'ws';

//<-------------------------------------------------EXPRESS SECTION------------------------------------------------->

expApp.use(express.json())

//ROUTES:
expApp.get('/watchparty',(req, res) => {
    res.status(200).json({
        "message":"SERVER WORKING"
    })
})

//REGISTRATION ROUTE:
//ALSO AN EXAMPLE OF CLIENT REQUEST VALIDATION:
expApp.post('/watchparty/auth/register', async (req, res) => {



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

//Login Route:

expApp.post('/watchparty/auth/login', async (req, res)=>{
    try{
        //STRING TYPE FIELDS VALIDATION LAYER:
        
        //DATA RECEPTION:
        const rawData = req.body;

        const stringFields =  Object.keys(rawData);
        
        if(fieldsAreStringType(stringFields, rawData)){
            res.status(400).json({
                "message": "User sent bad data",
                "status": "Bad Request"
            })
            res.end();
        }else{
            
            //MISSING FIELDS VALIDATION LAYER:
            
            //DATA CLEANING:
            let cleanedData = rawData;
            for(const field of Object.keys(rawData)){
                //EXCEPTION OF PASSWORD (they are propagated as is!):
                if(field === "password") continue;
                cleanedData[field] = rawData[field]?.trim();
            }
            
            if(!haveRequiredFields(Object.keys(cleanedData),cleanedData)){
                res.status(400).json({
                    "message": "User sent bad data",
                    "status": "Bad Request"
                })
            }else{
                //FORMAT VALIDATION & ERROR COLLECTION LAYER:
                let errors  = formatValidator(cleanedData);
                if(errors.length > 0){
                    res.status(400).json({
                        "message":"User sent bad data",
                        "errors":errors
                    })
                }else{
                    //LOOKING UP FOR EXISTING ACCOUNT:
                    const existingUser = await findExistingUser(cleanedData["username"],cleanedData["email"],User);
                    if(!existingUser){
                        res.status(401).json({
                            "message":"Invalid Credentials"
                        })
                    }else{
                        
                        //PASSWORD VERIFICATION LAYER:
                        const passwordHashVerification = await verifyPassword(cleanedData["password"],existingUser.passwordHash);
                        if(!passwordHashVerification){
                            res.status(401).json({
                                "message":"Invalid Credentials",
                                "status":"Unauthorized"
                            })
                        }else{
                            //JWT BEGINS!
                            const userJWT  = await createAccessToken(existingUser._id.toString(),getJwtSecret(),alg);
                            console.log(userJWT);
                             
                            //JWT TAMPERING TEST:
                            // const parts = userJWT.split('.');
                            // const payload = JSON.parse(
                                //     Buffer.from(parts[1], "base64url").toString()
                                // );
                                // payload.sub = 'USER_X';
                                // const tamperedpayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
                                
                                // const tamperedJWT = [parts[0],tamperedpayload,parts[2]].join('.');
                                
                                res.status(200).json({
                                    "message":"JWT issued",
                                    "status":"Authentication Successful"
                                });
                                
                            }
                    }
                }
                
            }
            
        }
        
    }catch(error) {
        console.error(error.message);
        res.status(500).json({
            "message": "Internal Server Error"
        });
    }
})


//New Room Route (PROTECTED):
expApp.post('/watchparty/newRoom',authMiddleware, async (req, res, next)=>{
    try{
        const newRoom = await createRoom(req.user);
        res.status(201).json({
            "message":`Room Created at URL: /watchparty/rooms/${newRoom.roomId}`,
            "status": "CREATED"
        })
    }catch(error){
        console.error(error)
    }
})

//Access Room Route(PROTECTED):
expApp.get('/watchparty/rooms/:roomId', authMiddleware,async (req, res)=>{
    try{
        const requestedRoom = req.params.roomId;
        const foundRoom = await findRequestedRoom(requestedRoom);

        //ROOM EXISTENCE CHECK:
        if(foundRoom == null){
            res.status(404).json({
                "message":"Room Not Found"
            })
        }else{
            if(!checkRoomExpiry(foundRoom.expiresAt)){
                //ROOM EXPIRED RESPONSE:
                res.status(410).json({
                    "message":"Room Time Limit Reached: Create New Room!",
                    "status":"Gone"
                })
            }else{
                //RESPONSE OBJECT=
                const roomResponse = {
                    roomInfo : {
                        roomId: foundRoom.roomId
                    },
                    hostInfo:{
                        username: foundRoom.hostId.username,
                        firstName: foundRoom.hostId.firstName
                    },
                    expiresAt: foundRoom.expiresAt
                
                }
                res.status(200).json(roomResponse);
            }
        }
        
    }catch(error){
        console.error(error.message);
        res.status(500).json({
            "message":"Something went wrong",
            "status":"Internal Server Error"
        })
    }

})



//Room Deletion Route(Protected):
expApp.delete('/watchparty/rooms/:roomId', authMiddleware, async(req, res, next)=>{
    try{
        //DELETION LOGIC
        const requestedRoom = req.params.roomId;
        const foundRoom = await findRequestedRoom(requestedRoom);

        //ROOM EXISTENCE CHECK:
        if(!foundRoom){
            res.status(404).json({
                "message":"Room Not Found",
                "status":"Not Found"
            })
        }else{
            //REQUEST FROM HOST VALIDATION:
            if(!(req.user === foundRoom.hostId._id.toString())){
                res.status(403).json({
                    "message":"You are not the host",
                    "status":"Forbidden"
                })
            }else{
                //ROOM DELETION LOGIC:
                const deletedRoom = await deleteRoom(requestedRoom);
                res.status(200).json({
                    "message":"Room Deleted: Proceed to Home Page",
                    "status":"No Content"
                })
            }
        }
    }catch(error){
        console.error(error.message);
        res.status(500).json({
            "message":"Something went wrong",
            "status":"Internal Server Error"
        })
    }
})


//<-------------------------------------------------MONGODB SECTION------------------------------------------------->
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

//ALL USER RETRIEVING FUNCTION:
async function getAllUsers(){
    const allUsers = await User.find();
    console.log(allUsers);
    return 0;
}
//ALL ROOM RETRIEVING FUNCTION:
async function getAllRooms(){
    const allRooms = await Room.find();
    console.log(allRooms);
    return 0;
}


//<-------------------------------------------------SERVER SECTION------------------------------------------------->

async function startServer(){
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MONGODB CONNECTION SUCCESSFULL");

    //NODE HTTP SERVER:
    const server = http.createServer(expApp);
    server.listen(process.env.PORT,()=>{
        console.log("NODE HTTP SERVER RUNNING AT LOCALHOST:5000")
    })

    //UPGRADE CONNECTION TO WEBSOCKET:
    const webSocketServer = new WebSocketServer({server})

    //LISTENING EVENT:
    webSocketServer.addListener("connection",(client)=>{});

    }catch(error){
        console.log("SERVER START ERROR");
        console.error(error);
    }
}

startServer();