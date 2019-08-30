import session_inst from '../MODELS/session';
import accounts from '../MODELS/User_Accounts';
import session_schema from '../JOI_VALIDATION/session_validation';
import Joi from '@hapi/joi';

class sessionControler{
    createSession(req, res){
        const mentorId= parseInt(req.body.mentorId);
        const questions= req.body.questions;
        const create_session_validation = Joi.validate(req.body, session_schema);
        if(create_session_validation.error){
            const create_session_errors=[];
            for(let index=0; index<create_session_validation.error.details.length; index++){
                create_session_errors.push(create_session_validation.error.details[index].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: create_session_errors
            });
        }else{
            const allAccs= accounts.AllAccounts;
            const USER_ACC= allAccs.find(accs=>accs.userId===parseInt(mentorId));
            if(!(USER_ACC)){
                return res.status(404).json({
                    status: 404,
                    error: "A user with such Id not found"
                });
            }else{
                const mentor_checking= USER_ACC.is_a_mentor;
                if(mentor_checking===true){
                    const menteeId= req.user_token.userId;
                    const menteeEmail= req.user_token.email;
                    const status="pending";
                    const input_data= {mentorId, menteeId, questions, menteeEmail, status};
                    
                    const createdSession= session_inst.createSession(input_data);
                    return res.status(200).json({
                        status: 200,
                        data: createdSession
                    });
                }else{
                    return res.status(404).json({
                        status: 404,
                        error: "A mentor with such Id not found"
                    });
                }
            }
        }
    }

    //Mentor accept mentorship session
    acceptSessionRequest(req, res){
        const sessId= parseInt(req.params.sessionId);
        const all_sess= session_inst.allSessions;
        const session_lookup= all_sess.find(single_sess=>single_sess.sessionId===sessId);
        if(session_lookup){
            const mentorId= req.user_token.userId;
            const check_session_mentor= session_lookup.mentorId;
            if(check_session_mentor===mentorId){
                const new_status= "accepted";
                session_lookup.status= new_status;
                const updatedSession= session_lookup;
                return res.status(200).json({
                    status: 200,
                    data: updatedSession
                });
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "You are not a mentor for this session"
                })
            }
        }else{
            return res.status(404).json({
                status: 404,
                error: "No session with such Id found"
            })
        }
    }
}

const session_contrl= new sessionControler();
export default session_contrl;