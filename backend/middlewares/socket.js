export const setSocketUser = async (socket, next) => {
    const { currentUserId } = req.local

    socket.user = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [currentUserId])

    next()
}

