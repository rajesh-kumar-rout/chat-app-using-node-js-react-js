import { Router } from "express"
import { checkValidationError } from "../utils/validation.js"
import { query, queryAll } from "../database/connection.js"
import { body, param } from "express-validator"

const router = Router()

router.get("/", async (req, res) => {
    const users = await queryAll('SELECT * FROM "recentConnectedUsers"')
    res.json(users)
})

router.post(
    "/:userId/messages",

    param("userId").isInt(),

    body("message").isLength({ max: 255 }),

    body("sendAt").isDate(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { message, sendAt } = req.body
        const { userId } = req.params

        if (await query('SELECT 1 FROM users WHERE id = $1 LIMIT 1', [userId])) {
            return res.status(404).json({ message: "Receiver not found" })
        }

        const newMessage = await query('INSERT INTO messages ("senderId", message, "receiverId", "sendAt") VALUES ($1, $2, $3, $4) RETURNING *', [currentUserId, message, userId, sendAt])

        res.status(201).json(newMessage)
    }
)

router.get(
    "/:userId/messages",

    param("userId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.params
        const { currentUserId } = req.local

        const messages = await query('SELECT "senderId", message, "receiverId", "sendAt" FROM messages WHERE ("senderId" = $1 AND "receiverId" = $2) OR ("senderId" = $2 AND "receiverId" = $1) LIMIT 1', [currentUserId, userId])

        res.json(messages)
    }
)

export default router