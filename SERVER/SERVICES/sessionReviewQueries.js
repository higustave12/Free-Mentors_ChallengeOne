import pool from '../test/MODELS/create';

class sessionReview{
    static async sessionReviewSelectFn(sessioIDs){
        const client = await pool.connect();
        try {
            const selectQuery = 'SELECT * FROM sessions WHERE sessionid=$1';
            const values = [sessioIDs];
            const response = await client.query(selectQuery, values);
            return response.rows[0]           
        } catch (error) {
            console.log(error)
        }
    }

    static async sessionReviewInsertFn(req, score, menteeFullName, remarks, sessioIDs){
        const client = await pool.connect();
        try {
            const reviewSessionUpdateQuery = 'UPDATE sessions SET score=$1, menteefullname=$2, remark=$3 WHERE sessionid=$4 RETURNING *';
            const updateSessionVals = [score, menteeFullName, remarks, sessioIDs];  
            const submitReviewResponse= await client.query(reviewSessionUpdateQuery, updateSessionVals);
            return submitReviewResponse.rows[0]
        } catch (error) {
            console.log(error)
        }
    }
}

export default sessionReview;