import pg from 'pg' ;
import 'dotenv/config'

const { Pool } = pg
 
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT  // ✅ adiciona essa linha
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})