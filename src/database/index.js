const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  password: 'hoanglong',
  host: 'localhost',
  port: 5432,
  database: 'hcmus_mods'
})

module.exports = pool