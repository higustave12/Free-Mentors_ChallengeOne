import pool from '../test/MODELS/create';

class deleteSession{
    static async deleteSessionSelectFn(sessionRevId){
        const client = await pool.connect();
        try{
            const deleteSessionSelectQuery= 'SELECT * FROM sessions WHERE sessionid=$1';
            const deleteSessionVals= [sessionRevId]
            const deleteSessionSelectResp= await client.query(deleteSessionSelectQuery, deleteSessionVals);
            return deleteSessionSelectResp.rows[0]
        }catch(error){
            console.log(error);
        };
    }
    static async deleteSessionDeleteFn(sessionRevId){
        const client = await pool.connect();
        try{
            const deleteSessionDeeleteQuery= 'DELETE FROM sessions WHERE sessionid=$1';
            const deleteSessionDelVals= [sessionRevId]
            const deleteSessionDeleteResp= await client.query(deleteSessionDeeleteQuery, deleteSessionDelVals);
            return deleteSessionDeleteResp.rows[0]
        }catch(error){
            console.log(error);
        };
    }
}

export default deleteSession;