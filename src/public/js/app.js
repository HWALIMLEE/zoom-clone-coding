const socket = io(); //io function은 알아서 socket.io를 실행하고 있는 서버를 찾을 것


const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");


function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value }, () => { //서버
        console.log("server is done");
    });
    input.value = "";
}
form.addEventListener("submit",handleRoomSubmit);