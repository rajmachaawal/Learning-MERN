import { WebSocket } from "ws";

const clientB = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE3OTM3NDIsImV4cCI6MTc5MTgzNjk0Mn0.hxsmz-TjMeLQpsgm3Uy-kdXIbuNxD5ARDOqRjvyPXkQ"
        }
    })

//CLIENT CONNECTION OPEN (readyState = 1):
clientB.addListener("open",()=>{
    console.log("connection OPEN!");

    //CLIENT LISTENING FOR MESSAGE
    clientB.addListener("message",(message)=>{
        console.log(message.toString());
    })
    // CLIENT SENDING MESSAGE:
    clientB.send("JOIN:GEQJY-87674",()=>{
        console.log("join request sent!");
    })
    // clientB.send("Hello World",()=>{
    //     console.log("message sent!")
    // })
})
