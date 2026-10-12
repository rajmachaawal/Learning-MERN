import { WebSocket } from "ws";
import { waitForResponse } from "../ws.js";

const client1 = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE3OTM3NDIsImV4cCI6MTc5MTgzNjk0Mn0.hxsmz-TjMeLQpsgm3Uy-kdXIbuNxD5ARDOqRjvyPXkQ"
        }
    })



//CLIENT CONNECTION OPEN (readyState = 1):
client1.addListener("open", async()=>{
    console.log("connection OPEN!");
    
    //CLIENT SENDING JOIN REQUEST:
    client1.send(JSON.stringify({
        type:"JOIN",
        roomId:"JCYNX-18203"
    }),()=>{
        console.log("join request sent!");
    })

    //CLIENT WAITING FOR JOIN APPROVAL:
    const joinResponse = await waitForResponse(client1);
    console.log("Server Response: ",joinResponse);

    //CLIENT LISTENING FOR MESSAGE
    client1.addListener("message",(message)=>{
        console.log(message.toString());
    })

    const payload = "A".repeat(65535);



    //CLIENT SENDING MESSAGE:
    client1.send(JSON.stringify({
        type:"CHAT",
        message:payload
    }),()=>{
        console.log("message sent!");
    })
    
    //CONNECTION CLOSE LISTENER:
    client1.addListener("close", (code, reason) => {
        if(code === 1009){
            console.log("Client closed due to message size limit exceeded.");
        }else{
            console.log(`Client closed with code: ${code}, reason: ${reason}`);
        }
    });


    //CONNECTION ERROR LISTENER:
    client1.addListener("error", (error) => {
        console.error(error.message);
    });
});
