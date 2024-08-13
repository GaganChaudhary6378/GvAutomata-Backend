import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: ["http://localhost:3001" ],
    credentials:true,
}));


export {app};