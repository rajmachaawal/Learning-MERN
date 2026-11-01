const socket = new WebSocket("ws://localhost:3000");
const peerConnection =  new RTCPeerConnection();

//BROWSER ROLE:
const params = new  URLSearchParams(window.location.search);
const browserRole = params.get("role");

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



dataChannel.addEventListener("open",()=>{
    console.log("Data channel is open!");
})


socket.addEventListener("open",()=>{
    console.log("connected to a websocket signaling server!");

    //BEFORE OFFER CREATION
    //CHECKING BROWSER ROLE:
    if(browserRole === "offerer"){
        //OFFER CREATION AND SENDING TO SERVER:
        peerConnection.createOffer()
        .then(async(offer) => {
            await peerConnection.setLocalDescription(offer);
            console.log("Offer created and set as local description!");
    
            //Sending offer created by BROWSER A to server:
            if(socket.readyState === WebSocket.OPEN){
                socket.send(JSON.stringify(peerConnection.localDescription));
            }
            console.log("Offer sent to server!");
        })
    }


    //SERVER GREETINGS:
    console.log("Connection Established!");
    const status = document.querySelector("#status");
    status.textContent = "Connected";
    
});

socket.addEventListener("message",async(event)=>{
    //SERVER MESSAGE RECIEVED:
    const messageObj = JSON.parse(event.data);

    if(messageObj.type === "offer"){
        console.log("Offer received from server!");
        console.log(messageObj.type);
        console.log(messageObj.sdp);

        //SETTING REMOTE DESCRIPTION:
        await peerConnection.setRemoteDescription(messageObj);
        console.log(peerConnection.signalingState);
        console.log("Remote description set!");

        //CREATING ANSWER AND SENDING TO SERVER:
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("Answer created and set as local description!");
        console.log(peerConnection.signalingState);

        
    }else{
        const serverMessage = document.querySelector('#serverMessage');
        serverMessage.textContent = messageObj.message;
    }
});