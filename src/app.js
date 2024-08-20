import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from './routes/user.routes.js';

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors({
    origin: ["http://localhost:3001", "https://github.com", "http://localhost:3002"],
    credentials: true, // Allows cookies and other credentials to be sent with the requests
}));

app.use("/api/v1/users", userRouter);

export { app };
