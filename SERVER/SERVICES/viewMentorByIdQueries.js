import pool from '../test/MODELS/create';

class viewMentor{
     static async viewSpecificMentor(singleUserId){
        const client = await pool.connect();
        try {
            const isMentorCheck=true;
            const ViewMentorByIdQuery = `SELECT * FROM users WHERE id=$1 AND mentor=$2`;
            const values = [singleUserId, isMentorCheck];
            const response = await client.query(ViewMentorByIdQuery, values);
            return response.rows[0];
        } catch (error) {
            console.log(error)
        }
    }
}

export default viewMentor;