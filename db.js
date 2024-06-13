import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: "haricharan1111",
    host: "localhost",
    port: 5432,
    database: "doctor"
});

export default pool;
