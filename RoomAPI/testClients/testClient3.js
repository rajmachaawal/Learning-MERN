import { WebSocket } from "ws";
import { chatJoin } from "../Controllers/chatController.js";

const clientC = new WebSocket("ws://localhost:5000")

//CONNECTION OPEN (readyState = 1):
clientC.addListener("open",()=>{
    console.log("Connection Open")
    chatJoin(clientC,"JOIN:UIOSG-34928");
})
