import { WebSocket } from "ws";
import { waitForResponse } from "../ws.js";

const client3 = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE4MTUwODksImV4cCI6MTc5MTg1ODI4OX0.xIxDlm3EYeeo3k4BbqfX6uC25Lz89pR2wI_nc4mHkEM"
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
