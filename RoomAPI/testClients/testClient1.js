import { WebSocket } from "ws";

const clientA = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE3OTM3NDIsImV4cCI6MTc5MTgzNjk0Mn0.hxsmz-TjMeLQpsgm3Uy-kdXIbuNxD5ARDOqRjvyPXkQ"
        }
    })

//CLIENT CONNECTION OPEN (readyState = 1):
clientA.addListener("open",()=>{
    console.log("connection OPEN!");
    
    //CLIENT LISTENING FOR MESSAGE
    clientA.addListener("message",(message)=>{
        console.log(message.toString());
    })
    //CLIENT SENDING MESSAGE:
    clientA.send("JOIN:GEQJY-87674",()=>{
        console.log("join request sent!");
    })
    setTimeout(()=>{
        clientA.close(1000,"Client A left!",()=>{
            console.log("Disconnection request sent!");
        })
    },10000)
    // clientA.send("CHAT:Hello B and C!",()=>{
    //     console.log("message sent!")
    // })

})
