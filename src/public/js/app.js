const socket = io();


const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices(); //모든 디바이스
        const cameras = devices.filter((device) => device.kind === 'videoinput'); // if 문으로 안써줘도 됨
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option)
        })
        console.log(cameras);
        console.log(devices);
    }catch(e){
        console.log(e);
    }
}

async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia ( //유저의 카메라와 오디오를 가져옴
        {
            audio:true,
            video: true
        });
        myFace.srcObject = myStream;
        await getCameras();
    } catch(e){
        console.log(e);
    }
}

getMedia();

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled)) //새로운 상태는 현재 상태의 반대
    if (!muted) {
        muteBtn.innerText = "Unmute" 
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