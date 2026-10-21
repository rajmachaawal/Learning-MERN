import { WebSocket } from "ws";
import { waitForResponse } from "../ws.js";

const client3 = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE4OTY3NDUsImV4cCI6MTc5MTkzOTk0NX0.GlzFm8SHwAG3t1EusksgbksuIKiidLm_FdQc88lW7So"
        }
    })



//CLIENT CONNECTION OPEN (readyState = 1):
client3.addListener("open", async()=>{
    console.log("connection OPEN!");
    
    //CLIENT SENDING JOIN REQUEST:
    client3.send(JSON.stringify({
        type:"JOIN",
        roomId:"HAYWH-08456"
    }),()=>{
        console.log("join request sent!");
    })

    //CLIENT WAITING FOR JOIN APPROVAL:
    const joinResponse = await waitForResponse(client3);
    console.log("Server Response: ",joinResponse);

    //CLIENT LISTENING FOR MESSAGE
    client3.addListener("message",(message)=>{
        console.log(message.toString());
    })
    //CLIENT SENDING MESSAGE:
    client3.send(JSON.stringify({
        type:"CHAT",
        message:"Hello everyone!"
    }),()=>{
        console.log("message sent!");
    })

})
