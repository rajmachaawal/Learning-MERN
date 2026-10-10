import { WebSocket } from "ws";

const fakeClient = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE2Mjg0MzgsImV4cCI6MTc5MTY3MTYzOH0.FqO0HROggGVMwJjWlNHMoU54NCE9zkkGLQjmEDLNnRE"
        }
    }
)

//CLIENT CONNECTION OPEN (readyState = 1):
fakeClient.addListener("open",()=>{
    console.log("connection OPEN!");
    
    //CLIENT LISTENING FOR MESSAGE
    fakeClient.addListener("message",(message)=>{
        console.log(message.toString());
    })
    //CLIENT SENDING MESSAGE:
    // fakeClient.send("JOIN:WRLEW-19932",()=>{
    //     console.log("join request sent!");
    // })
})
