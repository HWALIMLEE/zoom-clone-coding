const socket = io();


const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
        {
            audio:true,
            video: true
        });
        myFace.srcObject = myStream;
    } catch(e){
        console.log(e);
    }
}

getMedia();

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled))
    if (!muted) {
        muteBtn.innerText = "Unmute" //음소거가 되어 있지 않기 때문에 클릭을 하면 음소거
        muted = true;
    }else{
        muteBtn.innerText = "Mute"
        muted = false;
    }
}

function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled))
    if (cameraOff) { //카메라가 켜저 있다면
        cameraBtn.innerText = "Turn Camer Off"
        cameraOff = false; //카메라 켜져 있음
    }else{
        cameraBtn.innerText = "Turn Camer On"
        cameraOff=true;
    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick);