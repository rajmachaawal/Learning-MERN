import { WebSocket } from "ws";
import { chatJoin } from "../Controllers/chatController.js";

const clientB = new WebSocket("ws://localhost:5000")

//CONNECTION OPEN (readyState = 1):
clientB.addListener("open",()=>{
    console.log("Connection Open")
    chatJoin(clientB,"JOIN:UIOSG-34928");
})
