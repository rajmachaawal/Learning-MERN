import { WebSocket } from "ws";

const clientA = new WebSocket("ws://localhost:5000")

//CLIENT CONNECTION OPEN (readyState = 1):
clientA.addListener("open",()=>{
    console.log("connection OPEN!");
    
    //CLIENT LISTENING FOR MESSAGE
    clientA.addListener("message",(message)=>{
        console.log(message.toString());
    })
    //CLIENT SENDING MESSAGE:
    clientA.send("JOIN:UIOSG-34928",()=>{
        console.log("join request sent!");
    })
    clientA.send("CHAT:Hello B and C!",()=>{
        console.log("message sent!")
    })

    //CLIENT CONNECTION CLOSE:
    clientA.close(1000,"Normal Closure");

})
