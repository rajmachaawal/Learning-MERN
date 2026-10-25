const socket = new WebSocket("ws://localhost:3000");
const peerConnection =  new RTCPeerConnection();
const dataChannel  = peerConnection.createDataChannel("video-transfer");

peerConnection.createOffer()
.then(async(offer) => {
    await peerConnection.setLocalDescription(offer);
    console.log(peerConnection.signalingState);
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
    const messageObj = JSON.parse(event.data);
    const serverMessage = document.querySelector('#serverMessage');
    serverMessage.textContent = messageObj.message;
});