import express from 'express';
import account_controler from '../CONTROLLERS/userAcc_Controler';
import session_contrl from '../CONTROLLERS/session_Controler';
import {verifyToken} from '../JWT/jwt_conf';

const router= express.Router();

//User accounts routes
router.post('/api/v2/auth/signup',account_controler.createUseraccount); //Endpoint to create user account
router.post('/api/v2/auth/signin',account_controler.userLogin); //Endpoint to login a user
router.patch('/api/v2/user/:userId',verifyToken, account_controler.ChangeUserToMentor); //Endpoint to change user to mentor
router.get('/api/v2/mentors',verifyToken, account_controler.viewAllMentors); //Endpoint to view all registered mentors
router.get('/api/v2/mentors/:userId',verifyToken, account_controler.viewMentorById); //Endpoint to view a specific mentor by Id

//Mentorship session routes
router.post('/api/v2/session',verifyToken, session_contrl.createSession); //Create mentorship session
router.patch('/api/v2/sessions/:sessionId/accept',verifyToken, session_contrl.acceptSessionRequest); //Accept session req
router.patch('/api/v2/sessions/:sessionId/reject',verifyToken, session_contrl.rejectSessionRequest); //Reject session req
router.get('/api/v2/sessions',verifyToken, session_contrl.getAllSession); //Get all mentorship sessions
/*
router.post('/api/v1/session/:sessionId/review',verifyToken,session_contrl.reviewSession); //Review a mentorship session
router.delete('/api/v1/sessions/:sessionId/review',verifyToken,session_contrl.deleteSessionReview); //Delete session review
*/
export default router;
