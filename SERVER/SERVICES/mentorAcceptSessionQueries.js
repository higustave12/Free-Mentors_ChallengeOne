import pool from '../test/MODELS/create';

class mentorAcceptSession{
    static async mentorAcceptSelectFn(sessId){
        const client = await pool.connect();
        try {
            const acceptSessionSelectQuery = `SELECT * FROM sessions WHERE sessionid=$1`;
            const values = [sessId];
            const response = await client.query(acceptSessionSelectQuery, values);
            return response.rows[0]           
        } catch (error) {
            console.log(error)
        }
    }

    static async updateSessionFn(req, sessId){
        const client = await pool.connect();
        try {
            const mentorId= req.user_token.id;
            const new_status= "accepted";
            const updateSessionStatusQuery= 'UPDATE sessions SET status=$1 WHERE mentorid=$2 AND sessionid=$3 RETURNING *';
            const updateSessionStatusValues=[new_status, mentorId, sessId];
            const updateSessionResponse= await client.query(updateSessionStatusQuery, updateSessionStatusValues);
            return updateSessionResponse.rows[0]         
        } catch (error) {
            console.log(error)
        }
    }
}

export default mentorAcceptSession;