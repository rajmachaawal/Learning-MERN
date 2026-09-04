import dotenv from "dotenv";
dotenv.config();
import express from "express";
const expApp = express();
import mongoose from "mongoose";
import { fieldsAreStringType, haveRequiredFields } from "./validation.js";


//<------------------------------------EXPRESS SECTION----------------------------------------------------------------------->

expApp.use(express.json());

expApp.post("/api/auth/login", (req, res) => {
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

            if(!haveRequiredFields(Object.keys(cleanedData))){
                res.status(400).json({
                    "message": "User sent bad data",
                    "status": "Bad Request"
                })
            }else{
                //FORMAT VALIDATION & ERROR COLLECTION LAYER:
                res.status(200).json({
                    "message":"All fields are available"
                })
            }
            
            
            
        }
        
    }catch(error) {
        console.error(error.message);
        res.status(500,"API RESPONSE ERROR").json({
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
    }catch(error) {
        console.error(error.message);
    }
}

startServer();