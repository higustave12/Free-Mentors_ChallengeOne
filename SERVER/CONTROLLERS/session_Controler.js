import pool from '../test/MODELS/create';
import session_schema from '../JOI_VALIDATION/session_validation';
import session_review_schema from '../JOI_VALIDATION/session_review';
import Joi from '@hapi/joi';
import sessionReview from '../SERVICES/sessionReviewQueries';

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

    //Mentor accept mentorship session
    acceptSessionRequest(req, res){
        const sessId= parseInt(req.params.sessionId);
        const all_sess= session_inst.allSessions;
        const session_lookup= all_sess.find(single_sess=>single_sess.sessionId===sessId);
        if(session_lookup){
            const mentorId= req.user_token.id;
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

    getAllSession(req, res){
        const is_mentor_checking= req.user_token.mentor;
        if(is_mentor_checking===false){
            const mentee_ID= req.user_token.id;
            pool.connect((err, client, done) => {
                const select_query = `SELECT * FROM sessions WHERE menteeid= $1`;
                const values=[mentee_ID];
                client.query(select_query, values, (error, result) => {
                    if(result.rows.length>0){
                        return res.status(200).json({
                            status: 200,
                            data: result.rows
                        });
                    }else{
                        return res.status(404).json({
                            status: 404,
                            error: "No mentorship session found"
                        });
                    }
                });
                done();
            });
        }else{
            const mentor_ID= req.user_token.id;
            pool.connect((err, client, done) => {
                const select_query = `SELECT * FROM sessions WHERE mentorid= $1`;
                const values=[mentor_ID];
                client.query(select_query, values, (error, result) => {
                    if(result.rows.length>0){
                        return res.status(200).json({
                            status: 200,
                            data: result.rows
                        });
                    }else{
                        return res.status(404).json({
                            status: 404,
                            error: "No mentorship session found"
                        });
                    }
                });
                done();
            });
        }
    }

    async reviewSession(req, res){
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
            const selectQueryRes= await sessionReview.sessionReviewSelectFn(sessioIDs);
            if (selectQueryRes) {
                const foundSessionMenteeId = selectQueryRes.menteeid, foundSessionStatus = selectQueryRes.status, score = parseInt(req.body.score);
                const firstname = req.user_token.firstname, lastname = req.user_token.lastname, menteeFullName = firstname + " " + lastname;
                const remarks = req.body.remarks;
                if (foundSessionMenteeId === menteeIDs && foundSessionStatus === "accepted") {
                    const insertReviewRes= await sessionReview.sessionReviewInsertFn(req, score, menteeFullName, remarks, sessioIDs);
                    return res.status(200).json({
                        status: 200,
                        data: insertReviewRes
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