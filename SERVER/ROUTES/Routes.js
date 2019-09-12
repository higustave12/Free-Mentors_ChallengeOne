import express from 'express';
import account_controler from '../CONTROLLERS/userAcc_Controler';
import session_contrl from '../CONTROLLERS/session_Controler';
import {verifyToken} from '../JWT/jwt_conf';

const router= express.Router();

router.post('/api/v2/auth/signup',account_controler.createUseraccount);
router.post('/api/v2/auth/signin',account_controler.userLogin); 
router.patch('/api/v2/user/:userId',verifyToken, account_controler.ChangeUserToMentor); 
router.get('/api/v1/mentors',verifyToken, account_controler.viewAllMentors); 
router.get('/api/v1/mentors/:userId',verifyToken, account_controler.viewMentorById); 

router.post('/api/v2/session',verifyToken, session_contrl.createSession); 
router.patch('/api/v1/sessions/:sessionId/accept',verifyToken, session_contrl.acceptSessionRequest); 
router.patch('/api/v1/sessions/:sessionId/reject',verifyToken, session_contrl.rejectSessionRequest); 
router.get('/api/v2/sessions',verifyToken, session_contrl.getAllSession); 
router.post('/api/v1/session/:sessionId/review',verifyToken,session_contrl.reviewSession); 
router.delete('/api/v2/sessions/:sessionId/review',verifyToken,session_contrl.deleteSessionReview); 


export default router;
