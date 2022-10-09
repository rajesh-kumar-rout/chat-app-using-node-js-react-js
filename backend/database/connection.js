import pg from "pg"
import dotenv from "dotenv"

dotenv.config()
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value))

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false
    // }
})

client.connect()

export async function query(sql, params) {
    const { rows } = await client.query(sql, params)
    return rows.length ? rows[0] : null
}

export async function queryAll(sql, params) {
    const { rows } = await client.query(sql, params)
    return rows
}























// import mysql from "mysql2/promise"
// import { config } from "dotenv"

// config()
// let connection = null

// mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.PASSWORD
// })
//     .then(conn => connection = conn)

// export const query = async (sql, params) => {
//     const [rows] = connection.execute(sql, params)
//     return rows
// }

// export const findOne = async (sql, params) => {
//     const [rows] = connection.execute(sql, params)
//     return rows.length > 0 ? rows[0] : null
// }

