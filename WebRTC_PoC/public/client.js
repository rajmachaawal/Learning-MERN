const socket = new WebSocket("ws://localhost:3000");
const peerConnection =  new RTCPeerConnection();

//EVENT LISTENING FOR REMOTE DATA CHANNEL:
peerConnection.addEventListener("datachannel",(event)=>{
    console.log("Remote data channel received!")

    const incomingDataChannel = event.channel;
    incomingDataChannel.onmessage = (event) => {
        console.log(event.data);
    }
})

const dataChannel  = peerConnection.createDataChannel("video-transfer");
console.log(dataChannel.readyState);

peerConnection.createOffer()
.then(async(offer) => {
    await peerConnection.setLocalDescription(offer);
    //Sending offer created by BROWSER A to server:
    
    if(socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(peerConnection.localDescription));
    }
})


dataChannel.addEventListener("open",()=>{
    console.log("Data channel is open!");
})


socket.addEventListener("open",()=>{
    console.log("Connection Established!");
    const status = document.querySelector("#status");
    status.textContent = "Connected";
    
});

socket.addEventListener("message",(event)=>{
    //SERVER MESSAGE RECIEVED:
    console.log(event);
    // const messageObj = JSON.parse(event.data);
    // const serverMessage = document.querySelector('#serverMessage');
    // serverMessage.textContent = messageObj.message;
});