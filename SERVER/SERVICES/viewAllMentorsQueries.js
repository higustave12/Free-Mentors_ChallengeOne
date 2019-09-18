import pool from '../test/MODELS/create';

class viewMentors{
     static async viewAllMentors(){
        const client = await pool.connect();
        try {
            const isMentorCheck=true;
            const viewAllMentorsSelectQuery = `SELECT * FROM users WHERE mentor=$1`;
            const values = [isMentorCheck];
            const response = await client.query(viewAllMentorsSelectQuery, values);
            return response.rows;
        } catch (error) {
            console.log(error)
        }
    }
}

export default viewMentors;