import { Router } from "express"
import { checkValidationError } from "../utils/validation.js"
import { fetch, query, queryAll } from "../database/connection.js"
import { body, param } from "express-validator"

const router = Router()

router.get("/", async (req, res) => {
    const { currentUserId } = req.local

    const users = await query("SELECT users.id, users.name, users.profileImgUrl, tbl1.message FROM (SELECT ROW_NUMBER() OVER (PARTITION BY IF(senderId = 1, receiverId, senderId) ORDER BY sendAt DESC) as rowNum, messages.*, IF(senderId = :currentUserId, receiverId, senderId) AS userId FROM messages WHERE  senderId = :currentUserId OR receiverId = :currentUserId) AS tbl1 INNER JOIN users ON users.id = tbl1.userId WHERE tbl1.rowNum = :currentUserId ORDER BY sendAt DESC", { currentUserId })

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

        const messages = await queryAll('SELECT senderId, message, receiverId, sendAt FROM messages WHERE (senderId = :currentUserId AND receiverId = :userId) OR (senderId = :userId AND receiverId = :currentUserId)', { currentUserId, userId })

        res.json(messages)
    }
)

export default router