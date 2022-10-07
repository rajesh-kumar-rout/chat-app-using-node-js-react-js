import { Router } from "express"
import { checkValidationError } from "../utils/validation.js"
import { query, queryAll } from "../database/connection.js"
import { body, param } from "express-validator"

const router = Router()

router.post(
    "/",

    body("name").isLength({ min: 2, max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { name } = req.body

        if (await query('SELECT 1 FROM rooms WHERE "adminId" = $1 AND name = $2 LIMIT 1', [currentUserId, name])) {
            return res.status(409).json({ message: "Romm already exists" })
        }

        const room = await query('INSERT INTO rooms ("adminId", name) VALUES ($1, $2) RETURNING *', [currentUserId, name])

        res.status(201).json(room)
    }
)

router.delete(
    "/:roomId",

    param("roomId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { roomId } = req.params

        const room = await query('DELETE FROM rooms WHERE "adminId" = $1 AND id = $2 RETURNING *', [currentUserId, roomId])

        res.json(room)
    }
)

router.post(
    "/:roomId/members",

    param("roomId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { roomId } = req.params
        const { currentUserId } = req.local

        if (!await query('SELECT 1 FROM rooms WHERE id = $1 LIMIT 1', [roomId])) {
            return res.status(404).json({ message: "Room not found" })
        }

        if (await query('SELECT 1 FROM "roomMembers" WHERE "userId" = $1 AND "roomId" = $2 LIMIT 1', [currentUserId, roomId])) {
            return res.status(409).json({ message: "Already a member" })
        }

        const roomMembers = await query('INSERT INTO "roomMembers" ("userId", "roomId") VALUES ($1, $2) RETURNING *', [currentUserId, roomId])

        res.status(201).json(roomMembers)
    }
)

router.delete(
    "/:roomId/members",

    param("roomId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { roomId } = req.params

        const room = await query('DELETE FROM "roomMembers" WHERE "userId" = $1 AND "roomId" = $2 RETURNING *', [currentUserId, roomId])

        res.json(room)
    }
)

router.get(
    "/:roomId/members",

    param("roomId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { roomId } = req.params

        const rooms = await queryAll('SELECT users.id, users.name, users."createdAt" FROM "roomMembers" INNER JOIN users ON users.id = "roomMembers"."userId" WHERE "roomMembers"."roomId" = $1', [roomId])

        res.json(rooms)
    }
)

router.get(
    "/",

    async (req, res) => {
        const rooms = await queryAll('SELECT rooms.id, rooms.name, users.name AS "adminName", rooms."createdAt" FROM rooms INNER JOIN users ON users.id = rooms."adminId"')

        res.json(rooms)
    }
)

router.get(
    "/:roomId/messages",

    param("roomId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { roomId } = req.params

        const messages = await queryAll('SELECT messages.msg, messages."sendAt", messages."userId", users.name AS "userName" FROM messages INNER JOIN users ON users.id = messages."userId" WHERE messages."roomId" = $1', [roomId])

        res.json(messages)
    }
)

router.post(
    "/:roomId/messages",

    param("roomId").isInt(),

    body("msg").isLength({ min: 2, max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { roomId } = req.params
        const { msg } = req.body

        const message = await query('INSERT INTO messages ("roomId", msg, "userId") VALUES ($1, $2, $3) RETURNING *', [roomId, msg, currentUserId])

        res.status(201).json(message)
    }
)

router.delete(
    "/messages/:messageId",

    param("messageId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { messageId } = req.params

        const message = await query('DELETE FROM messages WHERE "userId" = $1 AND "messageId" = $2 RETURNING *', [currentUserId, messageId])

        res.json(message)
    }
)

export default router