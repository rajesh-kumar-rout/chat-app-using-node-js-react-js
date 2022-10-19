import express from "express"
import http from "http"
import { Server } from "socket.io"
import usersRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import { authenticate } from "./middlewares/authentication.js"
import cors from "cors"
import { config } from "dotenv"
import { setUp } from "./middlewares/setUp.js"
import fileUpload from "express-fileupload"
import path from "path"
import { cwd } from "process"

config()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))
app.use(setUp)
app.use(express.static("views"))

app.use("/api/users", authenticate, usersRoutes)
app.use("/api/auth", authRoutes)

io.on("connection", (socket) => {
    socket.on("message", (message) => {
        io.emit("messages", message)
    })
})

app.get("*", (req, res) => {
    res.sendFile(path.resolve(cwd() + "/views/index.html"))
})

server.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}...`)
})