import mongoose from "mongoose"
import { config } from "./app.config"

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    console.log("Connected to Mongodb")
  } catch (error) {
    console.error("Error connecting to MongoDB ", error)
    process.exit(1)
  }
}

export default ConnectDatabase
