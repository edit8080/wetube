import express from "express";
//const express = require("express");
const app = express();

const PORT = 4000;

const handleListening = () =>
  console.log(`Listening on: http://localhost:${PORT}`);

const handleHome = (req, res) => res.send("Hello from Home");
const handleProfile = (req, res) => res.send("You are on my profile");

app.get("/", handleHome);
app.get("/profile", handleProfile);

// 서버 포트 연결
app.listen(PORT, handleListening);
