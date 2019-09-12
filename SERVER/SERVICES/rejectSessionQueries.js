import pool from '../test/MODELS/create';

class mentorRejectSession{
    static async mentorRejectSelectFn(sessioId){
        const client = await pool.connect();
        try {
            const acceptSessionSelectQuery = `SELECT * FROM sessions WHERE sessionid=$1`;
            const values = [sessioId];
            const response = await client.query(acceptSessionSelectQuery, values);
            return response.rows[0]           
        } catch (error) {
            console.log(error)
        }
    }

    static async updateSessionRejectFn(req, sessioId){
        const client = await pool.connect();
        try {
            const mentorId= req.user_token.id;
            const new_status= "rejected";
            const updateSessionStatusQuery= 'UPDATE sessions SET status=$1 WHERE mentorid=$2 AND sessionid=$3 RETURNING *';
            const updateSessionStatusValues=[new_status, mentorId, sessioId];
            const updateSessionResponse= await client.query(updateSessionStatusQuery, updateSessionStatusValues);
            return updateSessionResponse.rows[0]         
        } catch (error) {
            console.log(error)
        }
    }
}

export default mentorRejectSession;