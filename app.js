import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { userRouter } from "./router";

const app = express();

const handleHome = (req, res) => res.send("Hello from Home");
const handleProfile = (req, res) => res.send("You are on my profile");

/* middleware */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

/* router */
app.get("/", handleHome);
app.get("/profile", handleProfile);

// import router
app.use("/user", userRouter);

export default app;
