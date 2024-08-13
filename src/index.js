import { app } from "./app";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

import connectDB from "./db";

connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    }); 