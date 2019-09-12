import pool from '../test/MODELS/create';
import create_acc_schema from '../JOI_VALIDATION/create_acc_validation';
import login_schema from '../JOI_VALIDATION/login_user_validation';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class userAccountControler{
    createUseraccount(req, res){
        dotenv.config();
        const user_secret= process.env.SECRET;
        const {firstName, lastName, email, password, address, bio, occupation, expertise}= req.body;
        const create_acc_validation = Joi.validate(req.body, create_acc_schema);
        if(create_acc_validation.error){
            const signup_errors=[];
            for(let i=0; i<create_acc_validation.error.details.length; i++){
                signup_errors.push(create_acc_validation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: signup_errors[0]
            });
        }else{
            pool.connect((err, client, done) => {
                const query = `SELECT * FROM users WHERE email = $1`; 
                const values = [email];
                client.query(query, values, (error, result) => {
                    if (result.rows[0]) {
                        return res.status(409).send({
                            status: 409,
                            error: `This account already exists.Try another one.`
                        });
                    }else {
                        const is_admin=false;
                        const is_a_mentor=false;
                        pool.connect((err, client, done) => {
                            const create_account_query = 'INSERT INTO users(firstname,lastname,email,password,address,bio,occupation,expertise,is_admin,is_a_mentor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
                            var create_user_values = [firstName.trim(), lastName.trim(), email.trim(), password.trim(), address.trim(), bio.trim(), occupation.trim(), expertise.trim(), is_admin, is_a_mentor];
                            client.query(create_account_query, create_user_values, (error, result) => {
                                const {userid,firstname,lastname,email,password,address,bio,occupation,expertise,is_admin,is_a_mentor}= result.rows[0];
                                const token= jwt.sign({userid,firstname,lastname,email,is_admin,is_a_mentor}, user_secret, { expiresIn: "1d" });
                                res.header('x-auth-token', token);
                                return res.status(201).send({
                                    status: 201,
                                    message: `User created successfully`,
                                    data: {token, userId:userid,firstName:firstname,lastName:lastname,email,address,bio,occupation,expertise,isAdmin:is_admin,isAmentor:is_a_mentor}
                                });
                            });
                            done();
                        });
                    }
                });
                done();
            });
        } 
    }

    userLogin(req, res) {
        dotenv.config();
        const user_secret = process.env.SECRET;
        const { email, password } = req.body;
        const login_user_validation = Joi.validate(req.body, login_schema);
        if (login_user_validation.error) {
            const login_errors = [];
            for (let j = 0; j < login_user_validation.error.details.length; j++) {
                login_errors.push(login_user_validation.error.details[j].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: login_errors[0]
            });
        } else {

            pool.connect((err, client, done) => {
                const query = `SELECT * FROM users WHERE email=$1 AND password=$2`;
                const values = [email, password];
                client.query(query, values, (error, result) => {
                    if (result.rows[0]) {
                        const {userid,firstname,lastname,email,password,address,bio,occupation,expertise,is_admin,is_a_mentor}= result.rows[0];
                        const token = jwt.sign({userid,firstname,lastname,email,is_admin,is_a_mentor}, user_secret, { expiresIn: "1d" });
                        res.header('x-auth-token', token)
                        return res.status(200).send({
                            status: 200,
                            message: `User is successfully logged in`,
                            data: {token, userId:userid,firstName:firstname,lastName:lastname,email,address,bio,occupation,expertise,isAdmin:is_admin,isAmentor:is_a_mentor}
                        });

                    }else{
                        return res.status(404).send({
                            status: 404,
                            error: `Account not found. Incorrect Username or Password`
                        })
                    }
                });
                done();
            });
        }
    }

    ChangeUserToMentor(req, res){
        const user_id= parseInt(req.params.userId);
        pool.connect((err, client, done) => {
            const query = `SELECT * FROM users WHERE userid=$1`;
            const values = [user_id];
            client.query(query, values, (error, result) => {
                if (result.rows[0]) {
                    const new_role= true;
                    const admin_role_check= req.user_token.is_admin;
                    if(admin_role_check===true){
                        pool.connect((err, client, done) => {
                            const update_to_mentor_status_query = 'UPDATE users SET is_a_mentor=$1 WHERE userid=$2';
                            const update_to_mentor_status_values = [new_role, user_id];
                            client.query(update_to_mentor_status_query, update_to_mentor_status_values, () => {
                                pool.connect((err, client, done) => {
                                    const query = `SELECT * FROM users WHERE userid=$1`;
                                    const values = [user_id];
                                    client.query(query, values, (error, result) => {
                                        const {userid,firstname,lastname,email,password,address,bio,occupation,expertise,is_admin,is_a_mentor}= result.rows[0];
                                        return res.status(200).json({
                                            status: 200,
                                            message: "User account changed to mentor",
                                            data: {token, userId:userid,firstName:firstname,lastName:lastname,email,address,bio,occupation,expertise,isAdmin:is_admin,isAmentor:is_a_mentor}
                                        });
                                    });
                                    done();
                                });
                            });
                            done();
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
            });
            done();
        });
    }

    viewAllMentors(req, res){
        const Is_a_mentor=true;
        pool.connect((err, client, done) => {
            const query = `SELECT * FROM users WHERE is_a_mentor=$1`;
            const values = [Is_a_mentor];
            client.query(query,values, (error, result) => {
                return res.status(200).json({
                    status: 200,
                    data: result.rows
                });
            });
            done();
        });
    }

    viewMentorById(req, res){
        const single_user_id= parseInt(req.params.userId);
        pool.connect((err, client, done) => {
            const query = `SELECT * FROM users WHERE userid=$1`;
            const values = [single_user_id];
            client.query(query,values, (error, result) => {
                if(!(result.rows[0])){
                    return res.status(404).json({
                        status: 404,
                        error: "A user with such Id not found"
                    });
                }else{
                    const mentor_check_val= result.rows[0].is_a_mentor;
                    if(mentor_check_val===true){
                        const {token, userid,firstname,lastname,email,address,bio,occupation,expertise,is_admin,is_a_mentor}=result.rows[0];
                        return res.status(200).json({
                            status: 200,
                            data: {token, userId:userid,firstName:firstname,lastName:lastname,email,address,bio,occupation,expertise,isAdmin:is_admin,isAmentor:is_a_mentor}
                        });
                    }else{
                        return res.status(404).json({
                            status: 404,
                            error: "A mentor for this Id not found"
                        });
                    }
                }
            });
            done();
        });
    }
}

const account_controler= new userAccountControler();
export default account_controler;