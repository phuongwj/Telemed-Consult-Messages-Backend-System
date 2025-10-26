import dotenv from 'dotenv';
dotenv.config(); 

import { Pool } from "pg";

const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'devuser',
    password: 'devpassword',
    database: "devdb"
})

export default pool;