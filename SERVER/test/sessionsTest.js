/*
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

chai.should();
chai.use(chaiHttp);

describe("Test on Mentorship sessions", ()=>{
    describe("POST/ Create a mentorship session", ()=>{
        it("Should create a new mentorship session", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const mentorId= 2;
            const questions= "I want to improve my javascript skills. Thank you";
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session`)
                .send({
                    mentorId,
                    questions
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        it("Should create a new mentorship session", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const mentorId= 3;
            const questions= "I want to learn Python. Thank you";
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session`)
                .send({
                    mentorId,
                    questions
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        it("Should NOT create a new mentorship session: mentorId not found", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const mentorId= 1;
            const questions= "I want to improve my javascript skills. Thank you";
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session`)
                .send({
                    mentorId,
                    questions
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("A mentor with such Id not found");
                        done();
                });
        });

        it("Should NOT create a new mentorship session: Account not found", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const mentorId= 100;
            const questions= "I want to improve my javascript skills. Thank you";
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session`)
                .send({
                    mentorId,
                    questions
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("A user with such Id not found");
                        done();
                });
        });

        it("Should NOT create a new mentorship session: Invalid input or Missing input", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const mentorId= 2;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session`)
                .send({
                    mentorId,
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(400);
                        res.body.should.have.property("error");
                        done();
                });
        });
    });

    describe("PATCH/ Accept a mentorship session request", ()=>{
        
        it("Should allow a mentor to accept a mentorship session request", (done)=>{
            const user_token = {
                id: 2,
                firstname: "AUGUSTIN",
                lastname: "NTAMBARA",
                email: "augustinntambara@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 1;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/accept`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        it("Should NOT allow a mentor to accept a mentorship session request: You are not a mentor for this session", (done)=>{
            const user_token = {
                id: 6,
                firstname: "EUGENE",
                lastname: "PARK",
                email: "eugenepark@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 1;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/accept`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("You are not a mentor for this session");
                        done();
                });
        });

        it("Should NOT allow a mentor to accept a mentorship session request: Session with such Id not found", (done)=>{
            const user_token = {
                id: 2,
                firstname: "AUGUSTIN",
                lastname: "NTAMBARA",
                email: "augustinntambara@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 10000;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/accept`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("No session with such Id found");
                        done();
                });
        });
    });

    describe("PATCH/ Reject a mentorship session request", ()=>{
        it("Should allow a mentor to reject a mentorship session request", (done)=>{
            const user_token = {
                id: 3,
                firstname: "FIDELE",
                lastname: "BIZIMANA",
                email: "fidelebizimana@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 2;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/reject`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        it("Should NOT allow a mentor to reject a mentorship session request: You are not a mentor for this session", (done)=>{
            const user_token = {
                id: 6,
                firstname: "EUGENE",
                lastname: "PARK",
                email: "eugenepark@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 2;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/reject`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("You are not a mentor for this session");
                        done();
                });
        });

        it("Should NOT allow a mentor to reject a mentorship session request: Session with such Id not found", (done)=>{
            const user_token = {
                id: 2,
                firstname: "AUGUSTIN",
                lastname: "NTAMBARA",
                email: "augustinntambara@gmail.com",
                admin: false,
                mentor: true
            };
            const sessionId= 3895;
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v2/sessions/${sessionId}/reject`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("No session with such Id found");
                        done();
                });
        });
    });

    describe("GET/ Get or View all mentorship sessions", ()=>{
        it("Should allow a user(Mentee) to Get or View all mentorship sessions: Mentee", (done)=>{
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v2/sessions`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });
        it("Should NOT allow a user(Mentee) to Get or View all mentorship sessions: Mentee (No mentorship session found)", (done)=>{
            const user_token = {
                id: 7,
                firstname: "AIME",
                lastname: "SIFA",
                email: "sifaaime@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v2/sessions`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("No mentorship session found");
                        done();
                });
        });

        it("Should allow a user(Mentor) to Get or View all mentorship sessions: Mentor", (done)=>{
            const user_token = {
                id: 2,
                firstname: "AUGUSTIN",
                lastname: "NTAMBARA",
                email: "augustinntambara@gmail.com",
                admin: false,
                mentor: true
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v2/sessions`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });
        it("Should NOT allow a user(Mentor) to Get or View all mentorship sessions: Mentor (No mentorship session found)", (done)=>{
            const user_token = {
                id: 4,
                firstname: "PAUL",
                lastname: "NSABIMANA",
                email: "paulnsabimana@gmail.com",
                admin: false,
                mentor: true
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v2/sessions`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("No mentorship session found");
                        done();
                });
        });
    });

    describe("POST/ Review a finished mentorship session", ()=>{
        it("Should allow a mentee to review a finished mentorship session", (done)=>{
            const sessionId= 1;
            const score= 2;
            const remark= "The mentor is good at explaining the subject";
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session/${sessionId}/review`)
                .send({
                    score,
                    remark
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

         it("Should NOT allow a mentee to review a finished mentorship session: A Reviewer is Not a mentee for this session", (done)=>{
            const sessionId= 1;
            const score= 3;
            const remark= "The mentor was not good at explaining";
            const user_token = {
                id: 4,
                firstname: "PAUL",
                lastname: "NSABIMANA",
                email: "paulnsabimana@gmail.com",
                admin: false,
                mentor: true
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session/${sessionId}/review`)
                .send({
                    score,
                    remark
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("You are not allowed to review this session");
                        done();
                });
        });

        it("Should NOT allow a mentee to review a finished mentorship session: Session not found", (done)=>{
            const sessionId= 980;
            const score= 4;
            const remark= "The mentor is good at explaining the subject";
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session/${sessionId}/review`)
                .send({
                    score,
                    remark
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("mentorship session not found");
                        done();
                });
        });

        it("Should NOT allow a mentee to review a finished mentorship session: Invalid or Insufficient input", (done)=>{
            const sessionId= 1;
            const score= 4;
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .post(`/api/v2/session/${sessionId}/review`)
                .send({
                    score,
                    //remark
                })
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(400);
                        res.body.should.have.property("error");
                        done();
                });
        });
    });

    describe("DELETE/ Delete a session review deemed as inappropriate", ()=>{
        it("Should allow an admin to Delete a session review deemed as inappropriate", (done)=>{
            const sessionId= 1;
            const user_token = {
                id: 1,
                firstname: "BRIGITE",
                lastname: "MUTONI",
                email: "mutonibrigitte@gmail.com",
                admin: true,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .delete(`/api/v2/sessions/${sessionId}/review`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        it("Should NOT allow an admin to Delete a session review: Session to delete not found", (done)=>{
            const sessionId= 1000;
            const user_token = {
                id: 1,
                firstname: "BRIGITE",
                lastname: "MUTONI",
                email: "mutonibrigitte@gmail.com",
                admin: true,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .delete(`/api/v2/sessions/${sessionId}/review`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("Denied! Check if session exists and its score<3 ");
                        done();
                });
        });

        it("Should NOT allow an mentee to Delete a session review: Only admin can delete a session review", (done)=>{
            const sessionId= 1000;
            const user_token = {
                id: 5,
                firstname: "DOROTHE",
                lastname: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                admin: false,
                mentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .delete(`/api/v2/sessions/${sessionId}/review`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(400);
                        res.body.should.have.property("error").equal("Denied! Only Admininstrator can delete a session review");
                        done();
                });
        });
    });
});
*/