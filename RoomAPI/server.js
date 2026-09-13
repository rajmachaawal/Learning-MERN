import mongoose from 'mongoose';
import express from 'express';
const expApp = express();
import dotenv from 'dotenv';
dotenv.config()
import {fieldsAreStringType, haveRequiredFields, formatValidator, checkRoomExpiry} from './validation.js'
import { findExistingUser, uniqueRoomGenerator, createRoom, getExpiryTime, getRoomId, findRequestedRoom, deleteRoom } from './mongodb.js'
import {Room, User} from './Models/room.model.js'
import { verifyPassword } from "ironpass";
import {createAccessToken,verifyAccessToken, getJwtSecret, alg} from './jwt.js'
import { authMiddleware } from './Middlewares/authMiddleware.js';

//<-------------------------------------------------EXPRESS SECTION------------------------------------------------->

expApp.use(express.json())

//ROUTES:
expApp.get('/watchparty',(req, res) => {
    res.status(200).json({
        "message":"SERVER WORKING"
    })
})

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
                res.status(204).json({
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


//<-------------------------------------------------SERVER SECTION------------------------------------------------->

async function startServer(){
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MONGODB CONNECTION SUCCESSFULL");

    expApp.listen(process.env.PORT,() => {
        console.log("EXPRESS SERVER RUNNING AT LOCALHOST:5000")
    })

    }catch(error){
        console.log("SERVER START ERROR");
        console.error(error);
    }
}

startServer();