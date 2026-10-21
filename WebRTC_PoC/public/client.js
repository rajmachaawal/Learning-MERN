const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open",()=>{
    console.log("Connection Established!");


    
});

socket.addEventListener("message",(event)=>{
    console.log(`Recieved: ${event.data}`);
});