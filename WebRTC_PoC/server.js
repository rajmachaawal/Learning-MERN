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

httpServer.listen(PORT, () => {
    console.log(`HTTP and WebSocket server running on port ${PORT}`);
});


const webSocketServer = new WebSocketServer({
    server: httpServer
})
//SERVER LISTENING OR A BROWSER CONNECTION
webSocketServer.on("connection",(socket)=>{
    socket.clientId =  randomUUID()
    console.log(`client: ${socket.clientId} connected`);

    socket.send(JSON.stringify({
        type:"message",
        message:"Connected to WebSocket signaling server"
    }))

    //SERVER LISTENING FOR BROWSER MESSAGE:
    socket.on("message",(data)=>{


        //CONVERTING BUFFER MESSAGE TO STRING():
        const debuffMessage = data.toString();
        const message  = JSON.parse(debuffMessage);


        //CHECKING MESSAGE TYPE:
        if(message.type === "offer"){
            
            //OFFER BROADCASTING:
            let clientSet =  webSocketServer.clients;
            for(let recievers of clientSet){
                if(socket.clientId != recievers.clientId && recievers.readyState === WebSocket.OPEN){
                    recievers.send(JSON.stringify(message));
                }
            }
        }
    })

    socket.on("close",()=>{
        console.log(`client: ${socket.clientId} disconnected`);
    })
})

console.log(`Signaling server running at port ${PORT}`)