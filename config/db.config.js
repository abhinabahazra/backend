// module.exports = {
//     HOST: "13.233.117.90",
//     USER: "magnox",
//     PASSWORD: "DaTaBaSe#123",
//     DB: "dbott",
//     dialect: "postgres",
//     PORT:5432,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };
const Pool = require('pg').Pool
const pool = new Pool({ 
  host: '13.233.117.90', 
  port: 5432,
  database: 'ott_live',
  user: 'magnox',
  password: 'DaTaBaSe#123'
 })
exports.pool=pool;