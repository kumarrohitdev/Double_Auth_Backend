import express from "express"
import UserRouter from "./router/user.router"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

//api routes
app.use("/api/user", UserRouter)


export default app;