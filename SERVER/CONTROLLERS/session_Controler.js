import pool from '../test/MODELS/create';
import session_schema from '../JOI_VALIDATION/session_validation';
import Joi from '@hapi/joi';
import {acceptSessionSelectQuery} from '../SERVICES/mentorAcceptSessionQueries';
import {updateSessionStatusQuery} from '../SERVICES/mentorAcceptSessionQueries';

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
                error: create_session_errors[0]
            });
        }else{
            const allAccs= accounts.AllAccounts;
            const USER_ACC= allAccs.find(accs=>accs.id===parseInt(mentorId));
            if(!(USER_ACC)){
                return res.status(404).json({
                    status: 404,
                    error: "A user with such Id not found"
                });
            }else{
                const mentor_checking= USER_ACC.isAmentor;
                if(mentor_checking===true){
                    const menteeId= req.user_token.id;
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

    acceptSessionRequest(req, res){
        const sessId= parseInt(req.params.sessionId);
        pool.connect((err, client, done) => {
            const select_query_value=[sessId];
            client.query(acceptSessionSelectQuery, select_query_value, (error, result) => {
                if(result.rows[0]){
                    const mentorId= req.user_token.id;
                    const check_session_mentor= result.rows[0].mentorid;
                    if(check_session_mentor==mentorId){
                        const new_status= "accepted";
                            const update_session_status_values=[new_status, mentorId, sessId];
                            client.query(updateSessionStatusQuery, update_session_status_values, ()=>{
                                    const sel_query_values=[sessId];
                                    client.query(acceptSessionSelectQuery, sel_query_values, (error, result)=>{
                                        const {sessionid, mentorid, menteeid, questions, menteeemail, status}= result.rows[0];
                                        return res.status(200).json({
                                            status: 200,
                                            data: {sessionId:sessionid, mentorId:mentorid, menteeId:menteeid, questions, menteeEmail:menteeemail, status}
                                        });
                                    });
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
            });
            done();
        });
    }
    //Mentor reject mentorship session
    rejectSessionRequest(req, res){
        const sessioId= parseInt(req.params.sessionId);
        const all_sessio= session_inst.allSessions;
        const session_lookups= all_sessio.find(single_sessio=>single_sessio.sessionId===sessioId);
        if(session_lookups){
            const mentorId= req.user_token.id;
            const check_session_mentors= session_lookups.mentorId;
            if(check_session_mentors===mentorId){
                const new_session_status= "rejected";
                session_lookups.status= new_session_status;
                const updatedSessions= session_lookups;
                return res.status(200).json({
                    status: 200,
                    data: updatedSessions
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

    //Get or View all sessions
    getAllSession(req, res){
        const is_mentor_checking= req.user_token.isAmentor;
        const allsess= session_inst.allSessions;

        if(is_mentor_checking===false){
            const mentee_ID= req.user_token.id;
            const mentee_sessions= allsess.filter(mentee=>mentee.menteeId===mentee_ID);
            if(mentee_sessions.length>=1){
                return res.status(200).json({
                    status: 200,
                    data: mentee_sessions
                });
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "No mentorship session found"
                });
            }
        }else{
            const mentor_ID= req.user_token.id;
            const mentor_sessions= allsess.filter(mentor=>mentor.mentorId===mentor_ID);
            if(mentor_sessions.length>=1){
                return res.status(200).json({
                    status: 200,
                    data: mentor_sessions
                });
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "No mentorship session found"
                });
            }
        }
    }

    //Review a specific mentorship session
    reviewSession(req, res){
        const session_review_validation = Joi.validate(req.body, session_review_schema);
        if(session_review_validation.error){
            const session_review_errors=[];
            for(let index=0; index<session_review_validation.error.details.length; index++){
                session_review_errors.push(session_review_validation.error.details[index].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: session_review_errors[0]
            });
        }else{
            const sessioIDs=parseInt(req.params.sessionId);
            const menteeIDs=req.user_token.id;
            const allSESSIONS= session_inst.allSessions;
            const single_session_search= allSESSIONS.find(single_sess=>single_sess.sessionId===sessioIDs);
            if(single_session_search){
                const found_session_menteeId= single_session_search.menteeId;
                const found_session_status= single_session_search.status;
                if(found_session_menteeId===menteeIDs && found_session_status==="accepted"){
                    const score= parseInt(req.body.score);
                    const firstname= req.user_token.firstName;
                    const lastname= req.user_token.lastName;
                    const menteeFullName= firstname +" " +lastname;
                    const remark= req.body.remark;

                    //Add properties to a session
                    single_session_search.score=score;
                    single_session_search.menteeFullName= menteeFullName;
                    single_session_search.remark= remark;

                    return res.status(200).json({
                        status: 200,
                        data: single_session_search
                    });
                }else{
                    return res.status(404).json({
                        status: 404,
                        error: "You are not allowed to review this session"
                    });
                }
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "mentorship session not found"
                });
            }
        }
    }

    //Delete a review deemed as inappropriate (By admin only)
    deleteSessionReview(req, res){
        const is_admin_check= req.user_token.isAdmin;
        if(is_admin_check===true){
            const sess_rev_id= parseInt(req.params.sessionId);
            const session_arr= session_inst.allSessions;
            const session_exist= session_arr.find(session_chk=>session_chk.sessionId===sess_rev_id);
            if((session_exist) && (session_exist.score) && (session_exist.score<3)){
                const found_session_index= session_arr.indexOf(session_exist);
                session_arr.splice(found_session_index, 1);
                return res.status(200).json({
                    status: 200,
                    data: {
                        message: "Review successfully deleted"
                    }
                });
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "Denied! Check if session exists and its score<3 "
                });
            }
        }{
            return res.status(400).json({
                status: 400,
                error: "Denied! Only Admininstrator can delete a session review"
            });
        }
    }
}

const session_contrl= new sessionControler();
export default session_contrl;