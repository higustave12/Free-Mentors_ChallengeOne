import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import executor from '../SERVICES/config';
import queries from '../SERVICES/queries';

dotenv.config();

class userAccountControler{
    static async createUserAccount(req, res) {
            const signupSecret= process.env.SECRET;
            const accExist = await executor(queries.usersQueries.accountExists, [(req.body.email).trim()]);
            if (accExist[0]) {
                return res.status(409).send({
                    status: 409,
                    error: `This account already exists.Try another one.`
                });
            } else {
                const admin = false, mentor = false;
                const insertNewUserQueryResult = await executor(queries.usersQueries.insertNewUser, [req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim(), req.body.password.trim(), req.body.address.trim(), req.body.bio.trim(), req.body.occupation.trim(), req.body.expertise.trim(), admin, mentor])
                const { id, firstname, lastname, email, address, bio, occupation, expertise} = insertNewUserQueryResult[0];
                const token = jwt.sign({ id, firstname, lastname, email, admin, mentor }, signupSecret, { expiresIn: "1d" });
                res.header('x-auth-token', token);
                return res.status(201).send({
                    status: 201,
                    message: `User created successfully`,
                    data: { token, id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}
                });
            }
    }

    static async useLogin(req, res){
        const loginSecret= process.env.SECRET;
        const userExistsResults= await executor(queries.usersQueries.loginSelectQuery, [(req.body.email).trim(),(req.body.password).trim()]);
        if(userExistsResults[0]){
            const { id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor} = userExistsResults[0];
            const token= jwt.sign({ id, firstname, lastname, email, admin, mentor}, loginSecret, {expiresIn: "1d"});
            res.header('x-auth-token', token);
            return res.status(200).send({
                status: 200,
                message: `User is successfully logged in`,
                data: {token, id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}
            });
        }else{
            return res.status(404).send({
                status: 404,
                error: `Account not found. Incorrect Username or Password`
            })
        }
    }

    static async changeUserToMentor(req, res){
        const userId= parseInt(req.params.userId);
        const searchUser= await executor(queries.usersQueries.changeUserToMentorSelectQuery, [userId]);
        if(searchUser[0]){
            const adminRoleCheck= req.user_token.admin;
            if(adminRoleCheck===true){
                const newRole= true;
                const updateUserRole= await executor(queries.usersQueries.updateMentorStatusQuery, [newRole, userId]);
                const {id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}=updateUserRole[0];
                return res.status(200).json({
                    status: 200,
                    message: "User account changed to mentor",
                    data: {id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}
                });
            }else{
                return res.status(400).json({
                    status: 400,
                    error: "Only Administrator can change a user to a mentor"
                });
            }
        }else{
            return res.status(404).json({
                status: 404,
                error: "A mentee with such userId not found"
            });
        }
    }

 /* 
    async viewAllMentors(req, res) {
        const allMentors = await viewMentors.viewAllMentors();
        return res.status(200).json({
            status: 200,
            data: allMentors
        });
    }

    async viewMentorById(req, res){
        const single_user_id= parseInt(req.params.userId);
        const singleMentor = await viewMentor.viewSpecificMentor(single_user_id);
        const datas=singleMentor;
        if(singleMentor){
            return res.status(200).json({
                status: 200,
                data: datas
            });
        }else{
            return res.status(404).json({
                status: 404,
                error: "Mentor not found"
            });
        }
    }
*/
}

export default userAccountControler;