import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const authenticate = (req, res, next) => {
    let { authorization } = req.headers

    authorization = authorization && authorization.startsWith("Bearer ") &&
        authorization.substring(7, authorization.length)

    try {
        const { currentUserId } = jwt.verify(authorization, process.env.JWT_SECRECT)
        req.local = { currentUserId }
        next()
    } catch {
        res.status(401).json({ message: "Unauthenticated" })
    }
}
