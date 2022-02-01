import express from "express";
import { handle } from "express/lib/application";
import http from "http";
import SocketIo from "socket.io"
// import WebSocket from "ws";
const app = express(); 

app.set("view engine","pug"); //view engine
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + '/public')); //app은 frontend, server는 backend, user가 볼 수 있음
app.get("/",(req,res) => res.render("home")) //homepage render
app.get("/*",(req,res) => res.redirect("/")); //무슨 url을 입력해도 home으로 돌려보냄

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const httpServer = http.createServer(app); //http
// const wss = new WebSocket.Server({ server });  //wss(htp 서버 위애 websocket 서버)
const wsServer = SocketIo(httpServer);

function publicRooms() {
    const {
        sockets : {
            adapter : {sids,rooms},
        },
    } = wsServer; //sexy coding
    // equal this code
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.socketes.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    });
    return publicRooms;
}

//connection 받을 준비  
wsServer.on("connection", socket => {
    socket['nickname'] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`) //Socket Event:enter_room
    });
    socket.on("enter_room",(roomName,done) => {
        console.log(socket.id); // 9GHqFz-JRt1c0ylLAAAB 
        console.log(socket.rooms); //Set(1) { '9GHqFz-JRt1c0ylLAAAB' }
        socket.join(roomName); // 1. 방에 참가 
        console.log(socket.rooms); //Set(2) { '9GHqFz-JRt1c0ylLAAAB', 'ruby' }
        done();
        socket.to(roomName).emit("welcome",socket.nickname); // 2. welcome (나를 제외하고 모든 채팅방에 보냄)
        wsServer.sockets.emit("room_change", publicRooms()); // 연결된 모든 소켓에게 보내줌
    })
    socket.on("diconnecting", () => { //disconnecting 이벤트는 socket이 방을 떠나기 직전에 발생, 아직 방을 완전히 떠나지 않음
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname)) //연결을 끊은 사람 제외하고 보내짐
    })
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms())
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done(); // 프론트 엔드에서 실행하는 부분
    })
    socket.on('nickname', (nickname) => (socket['nickname'] = nickname)) //object
})

// in memory adapter 
// monogodb를 통해서 서버 간 통신
// adapter는 어플리케이션으로 통하는 창문(누가 연결되어 있는지, room이 얼마나 있는지)
// socket은 private room(socket id) + public room(내가 만든 방 이름)

// const sockets = []; //browser 추가

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon"
//     console.log(`sockets - ${sockets}`) 
//     console.log("Connected to Browser");
//     socket.on("close", () =>  //브라우저가 꺼졌을 때
//         console.log("Disconnected from the Browser"))
//     socket.on("message", (msg) => { //브라우저가 서버에 메시지를 보냈을 때
//         const message = JSON.parse(msg.toString('utf-8'));
//         switch(message.type) {
//             case "new_message":
//                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`)) 
//             case "nickname":
//                 socket["nickname"] = message.payload; //socket안에 정보 저장 가능
//         }
//     });
//     // socket.send("hello"); //브라우저에 메시지 보내기
// })

httpServer.listen(3000,handleListen); //동일한 포트 공유
// app.listen(3000, handleListen)



