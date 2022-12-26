import { Router } from "express"
import { checkValidationError } from "../utils/validation.js"
import { fetch, query } from "../database/connection.js"
import { body, param } from "express-validator"

const router = Router()

router.get("/", async (req, res) => {
    const users = await query("SELECT * FROM users")
    res.json(users)
})

router.post(
    "/:userId/messages",

    param("userId").isInt(),

    body("message").isLength({ max: 255 }),

    body("sendAt").isISO8601(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { message, sendAt } = req.body
        const { userId } = req.params

        if (currentUserId === userId) {
            return res.status(404).json({ message: "You can not be both sender and receiver." })
        }

        if (!await fetch("SELECT 1 FROM users WHERE id = ? LIMIT 1", [userId])) {
            return res.status(404).json({ message: "Receiver not found" })
        }

        await query("INSERT INTO messages (senderId, message, receiverId, sendAt) VALUES (?, ?, ?, ?)", [currentUserId, message, userId, sendAt])

        res.sendStatus(204)
    }
)

router.get(
    "/:userId/messages",

    param("userId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.params
        const { currentUserId } = req.local

        const messages = await query('SELECT senderId, message, receiverId, sendAt FROM messages WHERE (senderId = :currentUserId AND receiverId = :userId) OR (senderId = :userId AND receiverId = :currentUserId)', { currentUserId, userId })

        res.json(messages)
    }
)

export default router