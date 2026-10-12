import { WebSocket } from "ws";
import { waitForResponse } from "../ws.js";

const client2 = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE4MTUwNzUsImV4cCI6MTc5MTg1ODI3NX0.APSezTF96y-JTOrJjuy0jCtZ0VLuzAkBxLrvsrhA9MY"
        }
    })



//CLIENT CONNECTION OPEN (readyState = 1):
client2.addListener("open", async()=>{
    console.log("connection OPEN!");
    
    //CLIENT SENDING JOIN REQUEST:
    client2.send(JSON.stringify({
        type:"JOIN",
        roomId:"JCYNX-18203"
    }),()=>{
        console.log("join request sent!");
    })

    //CLIENT WAITING FOR JOIN APPROVAL:
    const joinResponse = await waitForResponse(client2);
    console.log("Server Response: ",joinResponse);

    //CLIENT LISTENING FOR MESSAGE
    client2.addListener("message",(message)=>{
        console.log(message.toString());
    })
    //CLIENT SENDING MESSAGE:
    client2.send(JSON.stringify({
        type:"CHAT",
        message:"HELLO EVERYONE!"
    }),()=>{
        console.log("message sent!");
    })

})
