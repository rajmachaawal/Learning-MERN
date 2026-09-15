import { WebSocket } from "ws";
import { chatJoin } from "../Controllers/chatController.js";

const clientD = new WebSocket("ws://localhost:5000")

//CONNECTION OPEN (readyState = 1):
clientD.addListener("open",()=>{
    console.log("Connection Open")
    chatJoin(clientD,"JOIN:ABCDE-12345");
})
