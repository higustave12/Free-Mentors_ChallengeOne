import pool from '../test/MODELS/create';

class createSession{
    static async createSessionSelectFn(mentorId){
        const client = await pool.connect();
        try {
            const createSessionSelectQuery = `SELECT * FROM users WHERE id = $1`; 
            const values = [mentorId];
            const response = await client.query(createSessionSelectQuery, values);
            return response.rows[0]           
        } catch (error) {
            console.log(error)
        }
    }

    static async insertSessionSelectFn(req){
        const client = await pool.connect();
        try {
            const menteeId = req.user_token.id, menteeEmail = req.user_token.email, questions = (req.body.questions).trim();
            const status = "pending", score = null, menteeFullName = null, remark = null;
            const mentorId= parseInt(req.body.mentorId);
            const createSessionInsertQuery = 'INSERT INTO sessions(mentorid,menteeid,questions,menteeemail,status,score,menteefullname,remark) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
            const values = [mentorId, menteeId, questions, menteeEmail, status, score, menteeFullName, remark];
            const insertResponse = await client.query(createSessionInsertQuery, values);
            return insertResponse.rows[0]           
        } catch (error) {
            console.log(error)
        }
    }
}

export default createSession;