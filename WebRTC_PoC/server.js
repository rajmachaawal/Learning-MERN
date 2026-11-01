import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const PORT = 3000;


const httpServer = createServer(async(request, response)=>{
    const url = new URL(request.url, `http://${request.headers.host}`);

    if(url.pathname === '/' || url.pathname === '/index.html'){
        try{
            const html = await readFile(
                new URL('./public/index.html', import.meta.url)
            );

            response.writeHead(200,{
                "Content-Type":"text/html charset=utf-8"
            })
            response.end(html);
        }catch(error){
            console.error("Failed to server HTML:",error.message);
            response.writeHead(500);
            response.end("Internal Server Error!");
        }
        return;
    }

    response.writeHead(404,{
        "Content-Type":"text/plain; charset=utf-8"
    });
    
    response.end("Not Found");
})


const webSocketServer = new WebSocketServer({
    server: httpServer
})
//SERVER LISTENING FOR A BROWSER CONNECTION
webSocketServer.on("connection",(socket)=>{

    socket.clientId =  randomUUID()
    console.log("A client request received!")
    console.log(`client: ${socket.clientId} connected`);

    socket.send(JSON.stringify({
        type:"message",
        message:"Connected to WebSocket signaling server"
    }))

    //SERVER LISTENING FOR BROWSER MESSAGE:
    socket.on("message",(data)=>{
        console.log(`client: ${socket.clientId} sent a message!`);


        //CONVERTING BUFFER MESSAGE TO STRING():
        const debuffMessage = data.toString();
        const message  = JSON.parse(debuffMessage);


        //CHECKING MESSAGE TYPE:
        console.log(`message type: ${message.type}`);
        if(message.type === "offer"){
            
            //OFFER BROADCASTING:
            console.log(`Broadcasting offer from client: ${socket.clientId}`);
            let clientSet =  webSocketServer.clients;
            for (const receiver of webSocketServer.clients) {

                if (
                    socket.clientId !== receiver.clientId &&
                    receiver.readyState === WebSocket.OPEN
                ) {
                    receiver.send(JSON.stringify(message));
                }
            }
        }
    });

    socket.on("close", () => {
        console.log(`client: ${socket.clientId} disconnected`);
    });
});

// START SERVER
httpServer.listen(PORT, () => {
    console.log(`HTTP and WebSocket server running on port ${PORT}`);
});