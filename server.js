import express from "express"
import http from "http"
import { Server } from "socket.io"
import roomRoutes from "./routes/rooms.js"
import authRoutes from "./routes/auth.js"
import { authenticate, authenticateSocket } from "./middlewares/authentication.js"
import { setSocketUser } from "./middlewares/socket.js"
import cors from "cors"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/rooms", authenticate, roomRoutes)
app.use("/api/auth", authRoutes)

io.use(authenticateSocket)
io.use(setSocketUser)

io.on("connection", (socket) => {
    socket.on("join", ({ roomId }) => {
        socket.join(roomId)
    })

    socket.on("leave", ({ roomId }) => {
        socket.leave(roomId)
    })

    socket.on("clientMsg", async ({ roomId, msg }) => {
        io.to(roomId).emit("serverMsg", {
            msg,
            sendAt,
            senderId: id,
            senderName: name
        })
    })
})

server.listen(3000, () => {
    console.log("listening to port 3000...")
})