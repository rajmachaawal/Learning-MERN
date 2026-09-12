import mongoose from 'mongoose';

const roomSchema  = new mongoose.Schema({
    roomId:{
        type:String,
        unique:true
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    expiresAt:{
        type:Date
    }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;