import pool from '../test/MODELS/create';
import session_schema from '../JOI_VALIDATION/session_validation';
//import session_review_schema from '../JOI_VALIDATION/session_review';
import Joi from '@hapi/joi';

class sessionControler{
    createSession(req, res){
        const create_session_validation = Joi.validate(req.body, session_schema);
        if(create_session_validation.error){
            const create_session_errors=[];
            for(let m=0; m<create_session_validation.error.details.length; m++){
                create_session_errors.push(create_session_validation.error.details[m].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: create_session_errors[0]
            });
        }else{
            const mentorId= parseInt(req.body.mentorId);
            pool.connect((err, client, done) => {
                const query = `SELECT * FROM users WHERE userid = $1`; 
                const values = [mentorId];
                client.query(query, values, (error, result) => {
                    if(!(result.rows[0])){
                        return res.status(404).json({
                            status: 404,
                            error: "A user with such Id not found"
                        });
                    }else{
                        const mentor_checking= result.rows[0].is_a_mentor;
                        if (mentor_checking===true) {
                            const menteeId = req.user_token.userid;
                            const menteeEmail = req.user_token.email;
                            const questions= req.body.questions;
                            const status = "pending";
                            const score=null;
                            const menteeFullName=null;
                            const remark=null;
                            pool.connect((err, client, done) => {
                                const create_session_query= 'INSERT INTO sessions(mentorid,menteeid,questions,menteeemail,status,score,menteefullname,remark) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
                                const input_data=[mentorId,menteeId,questions,menteeEmail,status,score,menteeFullName,remark];
                                client.query(create_session_query, input_data, (error, result) => {
                                    return res.status(200).json({
                                        status: 200,
                                        data: {sessionId: result.rows[0].sessionid,mentorId: result.rows[0].mentorid,
                                            menteeId: result.rows[0].menteeid,questions: result.rows[0].questions,
                                            menteeEmail: result.rows[0].menteeemail,status: result.rows[0].status
                                        }
                                    });
                                });
                                done();
                            });
                                                    
                        }else{
                            return res.status(404).json({
                                status: 404,
                                error: "A mentor with such Id not found"
                            });
                        }
                    }
                });
                done();
            });
        }
    }

    acceptSessionRequest(req, res){
        const sessId= parseInt(req.params.sessionId);
        pool.connect((err, client, done) => {
            const sessionStatus="pending";
            const select_query = `SELECT * FROM sessions WHERE sessionid=$1 AND status=$2`;
            const select_query_value=[sessId, sessionStatus];
            client.query(select_query, select_query_value, (error, result) => {
                if(result.rows[0]){
                    const mentorId= req.user_token.userid;
                    const check_session_mentor= result.rows[0].mentorid;
                    if(check_session_mentor==mentorId){
                        const new_status= "accepted";
                        pool.connect((err, client, done)=>{
                            const update_session_status= 'UPDATE sessions SET status=$1 WHERE mentorid=$2 AND sessionid=$3';
                            const update_session_status_values=[new_status, mentorId, sessId];
                            client.query(update_session_status, update_session_status_values, ()=>{
                                pool.connect((err, client, done)=>{
                                    const sel_query= 'SELECT * FROM sessions WHERE sessionid=$1';
                                    const sel_query_values=[sessId];
                                    client.query(sel_query, sel_query_values, (error, result)=>{
                                        return res.status(200).json({
                                            status: 200,
                                            data: {
                                                sessionId: result.rows[0].sessionid,mentorId: result.rows[0].mentorid,
                                                menteeId: result.rows[0].menteeid,questions: result.rows[0].questions,
                                                menteeEmail: result.rows[0].menteeemail,status: result.rows[0].status
                                            }
                                        });
                                    });
                                });
                            });
                            done();
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

    rejectSessionRequest(req, res){
        const sessioId= parseInt(req.params.sessionId);
        pool.connect((err, client, done) => {
            const sessionStatus="pending";
            const select_query = `SELECT * FROM sessions WHERE sessionid= $1 AND status=$2`;
            const select_query_value=[sessioId, sessionStatus];
            client.query(select_query, select_query_value, (error, result) => {
                if(result.rows[0]){
                    const slct_mentorId= req.user_token.userid;
                    const check_sessions_mentor= result.rows[0].mentorid;
                    if(check_sessions_mentor==slct_mentorId){
                        const new_session_status= "rejected";
                        pool.connect((err, client, done)=>{
                            const update_session_status_reject= 'UPDATE sessions SET status=$1 WHERE mentorid=$2 AND sessionid=$3';
                            const update_session_status_reject_values=[new_session_status, slct_mentorId, sessioId];
                            client.query(update_session_status_reject, update_session_status_reject_values, ()=>{
                                pool.connect((err, client, done)=>{
                                    const sel_reject_query= 'SELECT * FROM sessions WHERE sessionid=$1';
                                    const sel_reject_query_values=[sessioId];
                                    client.query(sel_reject_query, sel_reject_query_values, (error, result)=>{
                                        return res.status(200).json({
                                            status: 200,
                                            data: {
                                                sessionId: result.rows[0].sessionid,mentorId: result.rows[0].mentorid,
                                                menteeId: result.rows[0].menteeid,questions: result.rows[0].questions,
                                                menteeEmail: result.rows[0].menteeemail,status: result.rows[0].status
                                            }
                                        });
                                    });
                                    done();
                                });
                            });
                            done();
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

    getAllSession(req, res){
        const is_mentor_checking= req.user_token.is_a_mentor;

        if(is_mentor_checking===false){
            const mentee_ID= req.user_token.userid;
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
            const mentor_ID= req.user_token.userid;
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
}

const session_contrl= new sessionControler();
export default session_contrl;
