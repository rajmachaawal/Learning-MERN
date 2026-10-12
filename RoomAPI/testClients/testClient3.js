import { WebSocket } from "ws";

const clientC =new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE3OTM3NDIsImV4cCI6MTc5MTgzNjk0Mn0.hxsmz-TjMeLQpsgm3Uy-kdXIbuNxD5ARDOqRjvyPXkQ"
        }
    })

//CLIENT CONNECTION OPEN (readyState = 1):
clientC.addListener("open",()=>{
    console.log("connection OPEN");

    //CLIENT LISTENING FOR MESSAGE
    clientC.addListener("message",(message)=>{
        console.log(message.toString());
    })
    // CLIENT SENDING MESSAGE:
    clientC.send("JOIN:WCXLB-98628",()=>{
        console.log("join request sent");
    })
    // clientC.send("CHAT:Hello World",()=>{
    //     console.log("message sent!")
    // })

})