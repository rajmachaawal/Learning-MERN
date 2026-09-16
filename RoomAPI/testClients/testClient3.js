import { WebSocket } from "ws";

const clientC = new WebSocket("ws://localhost:5000")

//CLIENT CONNECTION OPEN (readyState = 1):
clientC.addListener("open",()=>{
    console.log("connection OPEN");

    //CLIENT LISTENING FOR MESSAGE
    clientC.addListener("message",(message)=>{
        console.log(message.toString());
    })
    // CLIENT SENDING MESSAGE:
    clientC.send("JOIN:UIOSG-34928",()=>{
        console.log("join request sent");
    })
    clientC.send("CHAT:Hello World",()=>{
        console.log("message sent!")
    })

})