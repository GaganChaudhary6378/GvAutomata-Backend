import mongoose from "mongoose";
import dotenv from "dotenv"
import { DB_NAME } from "../constants.js";

dotenv.config({path : "./.env"})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected || DB HOST :${connectionInstance.connection.host}`)

    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;