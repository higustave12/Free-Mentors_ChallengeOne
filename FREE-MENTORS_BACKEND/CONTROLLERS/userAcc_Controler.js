import accounts from '../MODELS/User_Accounts';
import create_acc_schema from '../JOI_VALIDATION/create_acc_validation';
import login_schema from '../JOI_VALIDATION/login_user_validation';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class userAccountControler{
    //Create account
    createUseraccount(req, res){
        dotenv.config();
        const user_secret= process.env.SECRET;
        const {firstName, lastName, email, password, address, bio, occupation, expertise}= req.body;
        const create_acc_validation = Joi.validate(req.body, create_acc_schema);
        if(create_acc_validation.error){
            const signup_errors=[];
            for(let index=0; index<create_acc_validation.error.details.length; index++){
                signup_errors.push(create_acc_validation.error.details[index].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: signup_errors
            });
        }else{
            const all_user_accounts= accounts.AllAccounts;
            const acc_exists= all_user_accounts.find(acc=>acc.email===email);
            if(acc_exists){
                return res.status(409).json({
                    status:409,
                    message: `This account already exists.Try another one.`
                });
            }else{
                const createdAccount= accounts.createAccount(req.body);
                const user_token= {
                    userId: createdAccount.userId,
                    firstName: createdAccount.firstName,
                    lastName: createdAccount.lastName,
                    email: createdAccount.email,
                    address: createdAccount.address,
                    bio: createdAccount.bio,
                    occupation: createdAccount.occupation,
                    expertise: createdAccount.expertise,
                    is_admin: createdAccount.is_admin,
                    is_a_mentor: createdAccount.is_a_mentor
                };

                const token= jwt.sign(user_token, user_secret, { expiresIn: "1d" });
                res.header('x-auth-token', token);

                return res.status(201).json({
                    status: 201,
                    message : 'User created successfully',
                    data: {
                        token: token,
                        userId: createdAccount.userId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        address: address,
                        bio: bio,
                        occupation: occupation,
                        expertise: expertise,
                        is_admin: createdAccount.is_admin,
                        is_a_mentor: createdAccount.is_a_mentor
                    }
                })
            }
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
                    userId: account_found.userId,
                    firstName: account_found.firstName,
                    lastName: account_found.lastName,
                    email: account_found.email,
                    address: account_found.address,
                    bio: account_found.bio,
                    occupation: account_found.occupation,
                    expertise: account_found.expertise,
                    is_admin: account_found.is_admin,
                    is_a_mentor: account_found.is_a_mentor
                };
                const token= jwt.sign(user_token, user_secret, { expiresIn: "1d" });
                res.header('x-auth-token', token);
                return res.status(200).json({
                    status:200,
                    message : 'User is successfully logged in',
                    data : {
                        token : token,
                        userId: account_found.userId,
                        firstName: account_found.firstName,
                        lastName: account_found.lastName,
                        email: account_found.email,
                        address: account_found.address,
                        bio: account_found.bio,
                        occupation: account_found.occupation,
                        expertise: account_found.expertise,
                        is_admin: account_found.is_admin,
                        is_a_mentor: account_found.is_a_mentor
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
        const user_found= all_users.find(users=>users.userId===user_id);
        if(user_found){
            const new_role= true;
            const admin_role_check= req.user_token.is_admin;
            if(admin_role_check===true){
                user_found.is_a_mentor= new_role;
                const updated_user_acc= user_found;
                return res.status(200).json({
                    status: 200,
                    message: "User account changed to mentor",
                    data: {
                        userId: updated_user_acc.userId,
                        firstName: updated_user_acc.firstName,
                        lastName: updated_user_acc.lastName,
                        email: updated_user_acc.email,
                        address: updated_user_acc.address,
                        bio: updated_user_acc.bio,
                        occupation: updated_user_acc.occupation,
                        expertise: updated_user_acc.expertise,
                        is_admin: updated_user_acc.is_admin,
                        is_a_mentor: updated_user_acc.is_a_mentor
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
        const mentor_users=accs.filter(user=>user.is_a_mentor===true);
            return res.status(200).json({
                status: 200,
                data: mentor_users
            });
    }

}

const account_controler= new userAccountControler();
export default account_controler;