const currentTime = new Date(Date.now());
console.log(currentTime.getTime());
const expTime = new Date('2026-09-13T12:07:32.500Z');
console.log(expTime.getTime());
const leftTime = expTime.getTime() - currentTime.getTime();
console.log(leftTime);


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