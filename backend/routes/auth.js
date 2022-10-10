import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { query } from "../database/connection.js"
import { authenticate } from "../middlewares/authentication.js"
import { body } from "express-validator"
import { checkFileMimeType, checkIsFileTruncated, checkValidationError, files } from "../utils/validation.js"
import { destroy, upload } from "../utils/cloudinary.js"

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        const jwtToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRECT, { expiresIn: "1h" })

        res.json({ jwtToken })
    }
)

routes.post(
    "/sign-up",

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

        if (await query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const user = await query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, await bcrypt.hash(password, 10)])

        res.status(201).json(user)
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

        const user = await query("SELECT password FROM users WHERE id = $1 LIMIT 1", [currentUserId])

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query("UPDATE users SET password = $1 WHERE id = $2", [await bcrypt.hash(newPassword, 10), currentUserId])

        res.json({ message: "Password changed successfully" })
    }
)

routes.get(
    "/account",

    authenticate,

    async (req, res) => {
        const { currentUserId } = req.local

        const user = await query('SELECT id, name, email, "profileImgUrl", "createdAt", "updatedAt" FROM users WHERE id = $1 LIMIT 1', [currentUserId])

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

        const user = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [currentUserId])

        if (await query("SELECT 1 FROM users WHERE email = $1 AND id != $2 LIMIT 1", [email, currentUserId])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        if (profileImg) {
            const { secure_url, public_id } = await upload(profileImg.tempFilePath)
            user.profileImgUrl && await destroy(user.profileImgId)
            user.profileImgUrl = secure_url
            user.profileImgId = public_id
        }

        const updatedUser = await query('UPDATE users SET name = $1, email = $2, "profileImgUrl" = $3, "profileImgId" = $4 WHERE id = $5 RETURNING id, name, email, "profileImgUrl", "createdAt", "updatedAt"', [name, email, user.profileImgUrl, user.profileImgId, currentUserId])

        res.json(updatedUser)
    }
)

export default routes