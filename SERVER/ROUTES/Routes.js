import express from 'express';
import userAccountControler from '../CONTROLLERS/userAcc_Controler';
import validateAccCreation from '../HELPERS/createAccValidation';
import userLoginValidation from '../HELPERS/userLoginvalidation';
//import session_contrl from '../CONTROLLERS/session_Controler';
import {verifyToken} from '../JWT/jwt_conf';

const router= express.Router();

router.post('/api/v2/auth/signup', validateAccCreation.userRegisterValidate, userAccountControler.createUserAccount);
router.post('/api/v2/auth/signin', userLoginValidation.validateLogin, userAccountControler.useLogin); 
router.patch('/api/v2/user/:userId',verifyToken,userAccountControler.changeUserToMentor);
/*
router.get('/api/v2/mentors',verifyToken, userAccountControler.viewAllMentors); 
router.get('/api/v2/mentors/:userId',verifyToken, account_controler.viewMentorById); 

router.post('/api/v2/session',verifyToken, session_contrl.createSession); 
router.patch('/api/v2/sessions/:sessionId/accept',verifyToken, session_contrl.acceptSessionRequest); 
router.patch('/api/v2/sessions/:sessionId/reject',verifyToken, session_contrl.rejectSessionRequest); 
router.get('/api/v2/sessions',verifyToken, session_contrl.getAllSession); 
router.post('/api/v2/session/:sessionId/review',verifyToken,session_contrl.reviewSession); 
router.delete('/api/v2/sessions/:sessionId/review',verifyToken,session_contrl.deleteSessionReview); 
*/

export default router;
