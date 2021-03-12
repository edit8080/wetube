const express = require("express");
const app = express();

const PORT = 4000;
// respond with "hello world" when a GET request is made to the homepage

function handleListening() {
  console.log(`Listening on: http://localhost:${PORT}`);
}
function handleHome(req, res) {
  // 사용자 요청 (req)
  console.log(req);

  // 서버 응답(res) 전송
  res.send("Hello from Home");
}
function handleProfile(req, res) {
  res.send("You are on my profile");
}
// app.post("/",handleHome); - post 방식
app.get("/", handleHome);

// "/profile" 경로로 접속 시 handleProfile 실행
app.get("/profile", handleProfile);

// 서버 포트 연결
app.listen(PORT, handleListening);
