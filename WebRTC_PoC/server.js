import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

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

webSocketServer.on("connection",(socket)=>{
    console.log("A client connected");

    socket.send(JSON.stringify({
        type:"message",
        message:"Connected to WebRTC signaling server"
    }))

    socket.on("message",(data)=>{
        console.log("Recieved:", data.toString());
    })

    socket.on("close",()=>{
        console.log("A client disconnected!");
    })
})

console.log(`Signaling server running at port ${PORT}`)