import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './Models/room.model.js';
dotenv.config();

function getExpiryTime(){
    const utcTime = new Date();
    const roomLimit = 8*60*60*1000;
    const expiryTime = new Date(utcTime.getTime() + roomLimit);
    return expiryTime;
}


const getRoomId = () => {
    //5 LETTER GENERATION
    const letters  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let fiveLetters = "";
    for(let i=0; i<5; i++){
        const randomIndex = Math.floor(Math.random()*letters.length);
        fiveLetters += letters[randomIndex];
    }
    //5 DIGIT NUMBER GENERATION:
    const digits = "0123456789";
    let fiveDigits = "";
    for(let i=0; i<5; i++){
        const randomIndex = Math.floor(Math.random()*digits.length);
        fiveDigits += digits[randomIndex];
    }
    //ASSEMBLING:
    const roomId = fiveLetters+"-"+fiveDigits;
    return roomId;
}


async function uniqueRoomGenerator(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");
        
        let generatedRoomId = "";
        let roomCount = 0;

        do{
            generatedRoomId = getRoomId();
            roomCount = await Room.countDocuments({ roomId: generatedRoomId });
        }while(roomCount>0);

        return generatedRoomId;

    } catch (error) {
        return console.error("Failed to start server:", error.message);
    }
}


const roomId = await uniqueRoomGenerator();

console.log(roomId);