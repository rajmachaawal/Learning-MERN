//FUNCTION THAT WAITS FOR RESPONSE BEFORE FURTHER EXECUTION:
function waitForResponse(client){
    return new Promise((resolve)=>{
        client.once("message",(message)=>{
            resolve(message.toString());
        });
    });
}

export { waitForResponse };