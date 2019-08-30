import express from 'express';
import account_controler from '../CONTROLLERS/userAcc_Controler';
import session_contrl from '../CONTROLLERS/session_Controler';
import {verifyToken} from '../JWT/jwt_conf';

const router= express.Router();

//User accounts routes
router.post('/api/v1/auth/signup',account_controler.createUseraccount); //Endpoint to create user account
router.post('/api/v1/auth/signin',account_controler.userLogin); //Endpoint to login a user
router.patch('/api/v1/user/:userId',verifyToken, account_controler.ChangeUserToMentor); //Endpoint to change user to mentor
router.get('/api/v1/mentors',verifyToken, account_controler.viewAllMentors); //Endpoint to view all registered mentors
router.get('/api/v1/mentors/:userId',verifyToken, account_controler.viewMentorById); //Endpoint to view a specific mentor by Id

//Mentorship session routes
router.post('/api/v1/session',verifyToken, session_contrl.createSession); //Create mentorship session
router.patch('/api/v1/sessions/:sessionId/accept',verifyToken, session_contrl.acceptSessionRequest); //Accept session req
router.patch('/api/v1/sessions/:sessionId/reject',verifyToken, session_contrl.rejectSessionRequest); //Reject session req

export default router;
