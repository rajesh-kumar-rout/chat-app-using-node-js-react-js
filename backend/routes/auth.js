import { Router } from "express"
import { fetch, query } from "../database/connection.js"
import { authenticate } from "../middlewares/authentication.js"
import { body } from "express-validator"
import { checkFileMimeType, checkIsFileTruncated, checkValidationError, files } from "../utils/validation.js"
import { destroy, upload } from "../utils/cloudinary.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await fetch("SELECT * FROM users WHERE email = ? LIMIT 1", [email])

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        const jwtToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRECT, { expiresIn: "1h" })

        res.json({ jwtToken })
    }
)

routes.post(
    "/create-account",

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { name, email, password } = req.body

        if (await fetch("SELECT 1 FROM users WHERE email = ? LIMIT 1", [email])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const { insertId } = await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, await bcrypt.hash(password, 10)])

        const jwtToken = jwt.sign({ currentUserId: insertId }, process.env.JWT_SECRECT, { expiresIn: "1h" })

        res.status(201).json({ jwtToken })
    }
)

routes.patch(
    "/change-password",

    authenticate,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { oldPassword, newPassword } = req.body

        const user = await fetch("SELECT password FROM users WHERE id = ? LIMIT 1", [currentUserId])

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query("UPDATE users SET password = ? WHERE id = ?", [await bcrypt.hash(newPassword, 10), currentUserId])

        res.sendStatus(204)
    }
)

routes.get(
    "/account",

    authenticate,

    async (req, res) => {
        const { currentUserId } = req.local

        const user = await fetch('SELECT id, name, email, profileImgUrl, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1', [currentUserId])

        res.json(user)
    }
)

routes.patch(
    "/edit-account",

    authenticate,

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    files("profileImg")
        .optional()
        .isObject()
        .bail()
        .custom(checkFileMimeType("image/jpeg", "image/jpeg", "image/png"))
        .custom(checkIsFileTruncated),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { name, email } = req.body
        const { profileImg } = req.files

        console.log(currentUserId);

        const user = await fetch("SELECT * FROM users WHERE id = ? LIMIT 1", [currentUserId])

        if (await fetch("SELECT 1 FROM users WHERE email = ? AND id != ? LIMIT 1", [email, currentUserId])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        if (profileImg) {
            const { secure_url, public_id } = await upload(profileImg.tempFilePath)
            user.profileImgUrl && await destroy(user.profileImgId)
            user.profileImgUrl = secure_url
            user.profileImgId = public_id
        }

        await query("UPDATE users SET name = ?, email = ?, profileImgUrl = ?, profileImgId = ? WHERE id = ?", [name, email, user.profileImgUrl, user.profileImgId, currentUserId])

        res.json({ profileImgUrl: user.profileImgUrl })
    }
)

export default routes