import pool from '../test/MODELS/create';
import {selectQuery} from '../SERVICES/userSignupQueries';
import {createAccountQuery} from '../SERVICES/userSignupQueries';
import {admin} from '../SERVICES/userSignupQueries';
import {mentor} from '../SERVICES/userSignupQueries';
import {loginSelectQuery} from '../SERVICES/userLoginQueries';
import {changeUserToMentorSelectQuery} from '../SERVICES/changeUserToMentorQueries';
import {updateMentorStatusQuery} from '../SERVICES/changeUserToMentorQueries';
import ViewMentorByIdQuery from '../SERVICES/viewMentorByIdQueries';
import create_acc_schema from '../JOI_VALIDATION/create_acc_validation';
import login_schema from '../JOI_VALIDATION/login_user_validation';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class userAccountControler{
    createUseraccount(req, res) {
        dotenv.config();
        const user_secret = process.env.SECRET;
        const { firstName, lastName, email, password, address, bio, occupation, expertise } = req.body;
        const create_acc_validation = Joi.validate(req.body, create_acc_schema);
        if (create_acc_validation.error) {
            const signup_errors = [];
            for (let i = 0; i < create_acc_validation.error.details.length; i++) {
                signup_errors.push(create_acc_validation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: signup_errors[0]
            });
        } else {
            pool.connect((err, client, done) => {
                const values = [email.trim()];
                client.query(selectQuery, values, (error, result) => {
                    if (result.rows[0]) {
                        return res.status(409).send({
                            status: 409,
                            error: `This account already exists.Try another one.`
                        });
                    } else {
                        const createUserValues = [firstName.trim(), lastName.trim(), email.trim(), password.trim(), address.trim(), bio.trim(), occupation.trim(), expertise.trim(), admin, mentor];
                        client.query(createAccountQuery, createUserValues, (error, result) => {
                            const { id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor } = result.rows[0];
                            const token = jwt.sign({id, email, admin, mentor}, user_secret, { expiresIn: "1d" });
                            res.header('x-auth-token', token);
                            return res.status(201).send({
                                status: 201,
                                message: `User created successfully`,
                                data: { token, id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor }
                            });
                        });
                    }
                });
                done();
            });
        }
    }

    
    userLogin(req, res){
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
                const values = [email.trim(), password.trim()];
                client.query(loginSelectQuery, values, (error, result) => {
                    if (result.rows[0]) {
                        const { id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor } = result.rows[0];
                        const token = jwt.sign({id, email, admin, mentor}, user_secret, { expiresIn: "1d" });
                        res.header('x-auth-token', token)
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
                });
                done();
            });
        }
    }

    ChangeUserToMentor(req, res){
        const user_id= parseInt(req.params.userId);
        pool.connect((err, client, done) => {
            const values = [user_id];
            client.query(changeUserToMentorSelectQuery, values, (error, result) => {
                if (result.rows[0]) {
                    const new_role= true;
                    const admin_role_check= req.user_token.admin;
                    if(admin_role_check===true){
                            const updateMentorStatusValues = [new_role, user_id];
                            client.query(updateMentorStatusQuery, updateMentorStatusValues, () => {
                
                                    const values = [user_id];
                                    client.query(changeUserToMentorSelectQuery, values, (error, result) => {
                                        const { id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor } = result.rows[0];
                                        return res.status(200).json({
                                            status: 200,
                                            message: "User account changed to mentor",
                                            data: {id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}
                                        });
                                    });
                                
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
        const accs= accounts.AllAccounts;
        const mentor_users=accs.filter(user=>user.isAmentor===true);
            return res.status(200).json({
                status: 200,
                data: mentor_users
            });
    }

    viewMentorById(req, res){
        const single_user_id= parseInt(req.params.userId);
        pool.connect((err, client, done) => {
            const values = [single_user_id];
            client.query(ViewMentorByIdQuery,values, (error, result) => {
                if(!(result.rows[0])){
                    return res.status(404).json({
                        status: 404,
                        error: "A user with such Id not found"
                    });
                }else{
                    const { id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor } = result.rows[0];
                    const mentor_check_val= result.rows[0].mentor;
                    if(mentor_check_val===true){
                        return res.status(200).json({
                            status: 200,
                            data: {mentorId:id, firstname, lastname, email, address, bio, occupation, expertise, admin, mentor}
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