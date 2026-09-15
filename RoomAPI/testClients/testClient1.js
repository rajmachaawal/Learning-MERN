import { WebSocket } from "ws";
import { chatJoin } from "../Controllers/chatController.js";

const clientA = new WebSocket("ws://localhost:5000")

//CONNECTION OPEN (readyState = 1):
clientA.addListener("open",()=>{
    console.log("Connection Open")
    chatJoin(clientA,"JOIN:UIOSG-34928");
})
