import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const usersQueries = {
    insertNewUser: `INSERT INTO users(firstname, lastname,email,password,address,bio,occupation,expertise,admin, mentor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    accountExists: `SELECT * FROM users WHERE email= $1`,
    loginSelectQuery: `SELECT * FROM users WHERE email=$1 AND password=$2`,
    changeUserToMentorSelectQuery: `SELECT * FROM users WHERE id=$1`,
    updateMentorStatusQuery: 'UPDATE users SET mentor=$1 WHERE id=$2 RETURNING *'
};

export default {usersQueries};
