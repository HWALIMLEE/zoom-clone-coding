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

//connection 받을 준비 
wsServer.on("connection", socket => {
    socket.on("enter_room", (msg, done) => { 
        console.log(msg);
        setTimeout(() => {
            done()
        }, 10000)
    })
})


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



