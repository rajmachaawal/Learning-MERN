import { WebSocket } from "ws";

const clientB = new WebSocket("ws://localhost:5000")

//CLIENT CONNECTION OPEN (readyState = 1):
clientB.addListener("open",()=>{
    console.log("connection OPEN!");

    //CLIENT LISTENING FOR MESSAGE
    clientB.addListener("message",(message)=>{
        console.log(message.toString());
    })
    // CLIENT SENDING MESSAGE:
    clientB.send("JOIN:UIOSG-34928",()=>{
        console.log("join request sent!");
    })
    clientB.send("Hello World",()=>{
        console.log("message sent!")
    })
})
