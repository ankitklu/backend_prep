const {Client} = require('pg');
const dotenv = require('dotenv');
dotenv.config();


const con = new Client({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
})

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
})

con.query('SELECT * FROM demotable', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res.rows);
    }
    con.end();
})
