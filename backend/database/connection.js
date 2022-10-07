import pg from "pg"
import dotenv from "dotenv"

pg.types.setTypeParser(pg.types.builtins.INT8, (value) => parseInt(value))

dotenv.config()

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