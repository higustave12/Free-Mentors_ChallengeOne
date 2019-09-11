import pool from '../test/MODELS/create';

class getAllSessions {
    static async getAllMenteeSessionsSelectFn(req) {
            const mentee_ID = req.user_token.id;
            const client = await pool.connect();
            try {
                const select_query = `SELECT * FROM sessions WHERE menteeid= $1`;
                const values = [mentee_ID];
                const getAllSessionMenteeResponse = await client.query(select_query, values); 
                return getAllSessionMenteeResponse.rows
            } catch (error) {
                console.log(error)
            }
    }

    static async getAllMentorSessionsSelectFn(req) {
        const mentor_ID = req.user_token.id;
            const client = await pool.connect();
            try {
                const select2_query = `SELECT * FROM sessions WHERE mentorid= $1`;
                const select2_values = [mentor_ID];
                const getAllSessionMentorResponse = await client.query(select2_query, select2_values);
                return getAllSessionMentorResponse.rows
            } catch (error) {
                console.log(error)
            }
    }
}

export default getAllSessions;