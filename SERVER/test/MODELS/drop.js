import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
 connectionString: process.env.DATABASE_URL
});

const dropTablesQuery = [
    `DROP TABLE IF EXISTS users CASCADE`,
    `DROP TABLE IF EXISTS sessions CASCADE`
  ];

const dropAllTables= async ()=>{
    for(let singleDropQuery of dropTablesQuery){
        await pool.query(singleDropQuery);
    }
    console.log(`All tables deleted successfully`);
};

dropAllTables();
