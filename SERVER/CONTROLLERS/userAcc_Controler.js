import pool from '../test/MODELS/create';
import {selectQuery} from '../SERVICES/userSignupQueries';
import {createAccountQuery} from '../SERVICES/userSignupQueries';
import {is_admin} from '../SERVICES/userSignupQueries';
import {is_a_mentor} from '../SERVICES/userSignupQueries';
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
                const values = [email.trim()];
                client.query(selectQuery, values, (error, result) => {
                    if (result.rows[0]) {
                        return res.status(409).send({
                            status: 409,
                            error: `This account already exists.Try another one.`
                        });
                    }else {
                        pool.connect((err, client, done) => {
                            const createUserValues = [firstName.trim(), lastName.trim(), email.trim(), password.trim(), address.trim(), bio.trim(), occupation.trim(), expertise.trim(), is_admin, is_a_mentor];
                            client.query(createAccountQuery, createUserValues, (error, result) => {
                                const user_token= result.rows[0];
                                const {userid, firstname, lastname, email, address, bio, occupation, expertise, is_admin, is_a_mentor }= result.rows[0];
                                const token= jwt.sign(user_token, user_secret, { expiresIn: "1d" });
                                res.header('x-auth-token', token);
                                return res.status(201).send({
                                    status: 201,
                                    message: `User created successfully`,
                                    data: {token, userid, firstname, lastname, email, address, bio, occupation, expertise, is_admin, is_a_mentor}
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

    //Login controler
    userLogin(req, res){
        dotenv.config();
        const user_secret= process.env.SECRET;
        const {email, password} = req.body;
        const login_user_validation = Joi.validate(req.body, login_schema);
        if(login_user_validation.error){
            const login_errors=[];
            for(let index=0; index<login_user_validation.error.details.length; index++){
                login_errors.push(login_user_validation.error.details[index].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: login_errors[0]
            });
        }else{
            const registered_accounts= accounts.AllAccounts;
            const account_found= registered_accounts.find(acc=>acc.email===email);

            if(account_found && account_found.password===password){
                const user_token= {
                    id: account_found.id,
                    firstName: account_found.firstName,
                    lastName: account_found.lastName,
                    email: account_found.email,
                    address: account_found.address,
                    bio: account_found.bio,
                    occupation: account_found.occupation,
                    expertise: account_found.expertise,
                    isAdmin: account_found.isAdmin,
                    isAmentor: account_found.isAmentor
                };
                const token= jwt.sign(user_token, user_secret, { expiresIn: "1d" });
                res.header('x-auth-token', token);
                return res.status(200).json({
                    status:200,
                    message : 'User is successfully logged in',
                    data : {
                        token : token,
                        id: account_found.id,
                        firstName: account_found.firstName,
                        lastName: account_found.lastName,
                        email: account_found.email,
                        address: account_found.address,
                        bio: account_found.bio,
                        occupation: account_found.occupation,
                        expertise: account_found.expertise,
                        isAdmin: account_found.isAdmin,
                        isAmentor: account_found.isAmentor
                    }
                });
            }else{
                return res.status(404).json({
                    status:404,
                    error: `Account not found. Incorrect Username or Password`
                });
            }
        }
    }

    //Change a user to a mentor(Done By admin)
    ChangeUserToMentor(req, res){
        const user_id= parseInt(req.params.userId);
        const all_users= accounts.AllAccounts;
        const user_found= all_users.find(users=>users.id===user_id);
        if(user_found){
            const new_role= true;
            const admin_role_check= req.user_token.isAdmin;
            if(admin_role_check===true){
                user_found.isAmentor= new_role;
                const updated_user_acc= user_found;
                return res.status(200).json({
                    status: 200,
                    message: "User account changed to mentor",
                    data: {
                        id: updated_user_acc.id,
                        firstName: updated_user_acc.firstName,
                        lastName: updated_user_acc.lastName,
                        email: updated_user_acc.email,
                        address: updated_user_acc.address,
                        bio: updated_user_acc.bio,
                        occupation: updated_user_acc.occupation,
                        expertise: updated_user_acc.expertise,
                        isAdmin: updated_user_acc.isAdmin,
                        isAmentor: updated_user_acc.isAmentor
                    }
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

     //View All mentors
    viewAllMentors(req, res){
        const accs= accounts.AllAccounts;
        const mentor_users=accs.filter(user=>user.isAmentor===true);
            return res.status(200).json({
                status: 200,
                data: mentor_users
            });
    }

    //View a specific mentor by Id
    viewMentorById(req, res){
        const single_user_id= parseInt(req.params.userId);
        const all_users_accs= accounts.AllAccounts;
        const user_acc= all_users_accs.find(acc=>acc.id===single_user_id);
        if(!(user_acc)){
            return res.status(404).json({
                status: 404,
                error: "A user with such Id not found"
            });
        }else{
            const mentor_check_val= user_acc.isAmentor;
            if(mentor_check_val===true){
                return res.status(200).json({
                    status: 200,
                    data: {
                        mentorId: user_acc.id,
                        firstName: user_acc.firstName,
                        lastName: user_acc.lastName,
                        email: user_acc.email,
                        address: user_acc.address,
                        bio: user_acc.bio,
                        occupation: user_acc.occupation,
                        expertise: user_acc.expertise,
                        isAdmin: user_acc.isAdmin,
                        isAmentor: user_acc.isAmentor
                    }
                });
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "A mentor for this Id not found"
                });
            }
        }
    }

}

const account_controler= new userAccountControler();
export default account_controler;