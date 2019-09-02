class Session{
    constructor(){
        this.allSessions=[];
    }
    createSession(req){
        const single_session={
            sessionId: this.allSessions.length+1,
            mentorId: req.mentorId,
            menteeId: req.menteeId,
            questions: req.questions,
            menteeEmail: req.menteeEmail,
            status: req.status
        }
        this.allSessions.push(single_session);
        return single_session;
    }
}

const session_inst= new Session();
export default session_inst;