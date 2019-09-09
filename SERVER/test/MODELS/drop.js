import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
 connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('connected to the db');
});

export const dropAllTables= ()=>{
    const drop_query= `DROP TABLE IF EXISTS users,sessions,reviews CASCADE`;
    pool.query(drop_query)
        .then((res) => {
            console.log(res);
            console.log("TABLES DELETED SUCCESSFULLY");
        })
        .catch((err) => {
            console.log(err);
            pool.end()
        });
};

export default pool;
require('make-runnable');
