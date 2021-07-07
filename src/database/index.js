const Pool = require('pg').Pool

const localPoolConfig = new Pool({
  user: 'postgres',
  password: 'hoanglong',
  host: 'localhost',
  port: 5432,
  database: 'hcmus_mods'
})

const pool = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false }
} : localPoolConfig
module.exports = pool