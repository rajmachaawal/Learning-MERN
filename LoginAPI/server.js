import dotenv from "dotenv";
dotenv.config();
import express from "express";
const expApp = express();
import mongoose from "mongoose";
import User from "./Models/user.model.js"
import { fieldsAreStringType, haveRequiredFields, formatValidator } from "./validation.js";
import { findExistingUser } from "./mongodb.js";
import { verifyPassword } from "ironpass";
import { SignJWT, jwtVerify } from "jose";
import { createAccessToken } from "./jwt.js";


//<------------------------------------EXPRESS SECTION----------------------------------------------------------------------->

expApp.use(express.json());

expApp.post("/api/auth/login", async (req, res) => {
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
                            //JWT ISSUANCE:
                            const userJWT = await createAccessToken((existingUser._id).toString());
                            console.log(userJWT);

                            res.status(200).json({
                                "message":"JWT issued",
                                "status":"Authentication Successful"
                            })
                            
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

//<-------------------------------------SERVER INITIATION SECTION------------------------------------------------------------>

async function startServer() {
    try {
        expApp.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");
    }catch(error) {
        console.error(error.message);
    }
}

startServer();