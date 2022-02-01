const socket = io(); //io function은 알아서 socket.io를 실행하고 있는 서버를 찾을 것


const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form"); // frontend에서 실행된 코드는 backend가 실행을 시킨 것
const room =  document.getElementById("room");

room.hidden= true;

let roomName;
let userName;

function backendDone(msg) {
    console.log(`The msg from backend:`,msg); 
}

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input'); //querySelector는 첫번째 인풋만 가져옴(querySelector('input'))
    const value = input.value;
    socket.emit('new_message', input.value ,roomName, () => {
        addMessage(`You: ${value}`) // 내 대화창에서 보이는 메시지
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room. hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit",handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault(); 
    const roomInput = form.querySelector("#roomName");
    const nameInput = form.querySelector("#userName");
    socket.emit("enter_room", roomInput.value, nameInput.value, //여러개의 argument넣을 수 있음
        showRoom // function이 가장 마지막 argument
    )
    roomName = roomInput.value;
    nickName = nameInput.value;
    roomName.value = '';
    nickName.value = '';
}
form.addEventListener("submit",handleRoomSubmit);


socket.on('welcome', (user) => {
    addMessage(`${user} joined!`)
})

socket.on("bye", (left) => {
    addMessage(`${left} left ㅠㅠ`)
})

socket.on("new_message", addMessage); // 메시지를 받는 부분(보내고 다른 사이트에서)
// = socket.on("new_message", (msg) => {addMessage(msg)})
