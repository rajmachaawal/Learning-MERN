import {Room, User} from './Models/room.model.js'


//FUNCTION LOOKING FOR EXISTIN USER IN MONGODB COLLECTIONS:
async function findExistingUser(username,email,User){
    const existingUser = await User.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })
    
    return existingUser;
}


//ROOM EXPIRE TIME GENERATOR:

function getExpiryTime(){

    const utcTime = new Date();

    const roomLimit = 8*60*60*1000;

    const expiryTime = new Date(utcTime.getTime() + roomLimit);

    return expiryTime;

}

//RANDOM RoomID GENERATOR:

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



//UNIQUE ROOMID VALIDATOR:
async function uniqueRoomGenerator(){
    try {
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
//ROOM DOCUMENT CREATION & SAVE:
async function createRoom(hostId){
    try{
        let generatedRoomId = await uniqueRoomGenerator();
        let generatedExpTime = getExpiryTime();
        const newRoom = new Room({
            hostId:hostId,
            roomId:generatedRoomId,
            expiresAt: generatedExpTime
        })
        const createdRoom = await newRoom.save();
        return createdRoom;
    }catch(error){
        console.error("Room Creation Error:", error.message);
    }
}

async function findRequestedRoom(roomId){
    const foundRoom = await Room.findOne({
        roomId: roomId
    })
    return foundRoom;
}



export { findExistingUser, uniqueRoomGenerator, createRoom, getExpiryTime, getRoomId, findRequestedRoom };