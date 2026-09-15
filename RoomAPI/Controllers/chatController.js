import { WebSocket, WebSocketServer } from "ws";

function chatJoin(client,message){
    client.send(message);
}



export {chatJoin}