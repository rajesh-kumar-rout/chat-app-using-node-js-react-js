import express from "express"
import http from "http"
import { Server } from "socket.io"
import usersRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import { authenticate, authenticateSocket } from "./middlewares/authentication.js"
import { setSocketUser } from "./middlewares/socket.js"
import cors from "cors"
import { config } from "dotenv"
import { setUp } from "./middlewares/setUp.js"
import fileUpload from "express-fileupload"
import { dirname } from "path"

config()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))
app.use(setUp)

app.use("/api/users", authenticate, usersRoutes)
app.use("/api/auth", authRoutes)

// io.use(authenticateSocket)
// io.use(setSocketUser)
import path from "path"
app.get('/view', (req, res) => {
    res.sendFile(path.resolve("./demo.html"))
})

io.on('connection', (socket) => {
    console.log("call");

    socket.on("message", (message) => {
        console.log("sending messsage...........");
        io.emit("messages", message)
    })
})

server.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}...`)
})