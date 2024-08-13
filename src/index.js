import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js"
const PORT = process.env.PORT || 8001
connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    }); 