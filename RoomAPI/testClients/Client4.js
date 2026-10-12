import { WebSocket } from "ws";

const clientD = new WebSocket("ws://localhost:5000")

//CLIENT CONNECTION OPEN (readyState = 1):
clientD.addListener("open",()=>{
    console.log("connection OPEN");

    //CLIENT LISTENING FOR MESSAGE
    clientD.addListener("message",(message)=>{
        console.log(message.toString());
    })
    // CLIENT SENDING MESSAGE:
    clientD.send("JOIN:ABCDE-12345",()=>{
        console.log("join request sent");
    })
    clientD.send("Hello World",()=>{
        console.log("message sent!")
    })

})