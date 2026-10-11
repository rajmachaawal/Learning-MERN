import { WebSocket } from "ws";

const fakeClient = new WebSocket(
    "ws://localhost:5000",
    {
        headers:{
            authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YTliMDY2NzZjMjYzMjkwNWU1YTlkOWEiLCJpYXQiOjE3OTE3Mjg4NTUsImV4cCI6MTc5MTc3MjA1NX0.eYEvwTERZcloe4gZa3NL3UnNSiY4737BIhUvW1bkj9g"
        }
    }
)
function waitForMessage(client) {
    return new Promise((resolve) => {
        client.once("message", (data) => {
            resolve(data.toString());
        });
    });
}

fakeClient.addListener("open", async () => {
    console.log("connection OPEN!");

    fakeClient.send("JOIN:VFHQO-70531");

    const firstResponse = await waitForMessage(fakeClient);
    console.log(firstResponse);

    fakeClient.send("JOIN:VFHQO-70530");

    const secondResponse = await waitForMessage(fakeClient);
    console.log(secondResponse);
});