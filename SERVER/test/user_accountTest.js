import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import JWT from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

chai.should();
chai.use(chaiHttp);

describe("Test on Welcome Message", ()=>{
    describe("GET/ Show Welcome Message", ()=>{
        it("Should show a Welcome Message", (done)=>{
            chai.request(app)
                .get("/")
                .end((req,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property("status").equal(200);
                    res.body.should.have.property("message").equal("WELCOME TO Free Mentors");
                    done();
                });
        });
    });
});
 
describe("Test on Handling invalid URL", ()=>{
    describe("Handling invalid URL", ()=>{
        it("Should Handle invalid URL", (done)=>{
            chai.request(app)
                .post("/api/v1/auth/")
                .send({
                    firstName: "EUGENE",
                    lastName: "PARK",
                    email: "eugenepark@gmail.com",
                    password: "12345",
                    address: "KOREA",
                    bio: "RUBY STUDENT",
                    occupation: "STUDENT",
                    expertise: "RUBY",
                })
                .end((req,res)=>{
                    res.should.have.status(404);
                    res.body.should.have.property("status");
                    res.body.should.have.property("error").equal("Ressources not found");
                    done();
                });
        });
    });
});

describe("Test on users accounts", ()=>{
    
    describe("POST/ Create user account", ()=>{
        
        it("Should create an account for a new user", (done)=>{
            chai.request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "EUGENE",
                    lastName: "PARK",
                    email: "eugenepark@gmail.com",
                    password: "12345",
                    address: "KOREA",
                    bio: "RUBY STUDENT",
                    occupation: "STUDENT",
                    expertise: "RUBY",
                })
               .end((req, res)=>{
                    res.should.have.status(201);
                    res.body.should.have.property("message").equal("User created successfully");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("token");
                    res.body.data.should.have.property("firstName");
                    res.body.data.should.have.property("lastName");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("address");
                    res.body.data.should.have.property("bio");
                    res.body.data.should.have.property("occupation");
                    res.body.data.should.have.property("expertise");
                    done();
               });
        });

        
        it("Should create an account for a new user", (done)=>{
            chai.request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "AIME",
                    lastName: "SIFA",
                    email: "sifaaime@gmail.com",
                    password: "12345",
                    address: "TANZANIA",
                    bio: "PHP STUDENT",
                    occupation: "STUDENT",
                    expertise: "PHP",
                })
               .end((req, res)=>{
                    res.should.have.status(201);
                    res.body.should.have.property("message").equal("User created successfully");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("token");
                    res.body.data.should.have.property("firstName");
                    res.body.data.should.have.property("lastName");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("address");
                    res.body.data.should.have.property("bio");
                    res.body.data.should.have.property("occupation");
                    res.body.data.should.have.property("expertise");
                    done();
               });
        });

        
        it("Should NOT create an account for a new user: Invalid/Insufficient input", (done)=>{
            chai.request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "EUGENE",
                    email: "eugenepark@gmail.com",
                    password: "12345",
                    address: "KOREA",
                    bio: "RUBY STUDENT",
                    occupation: "STUDENT",
                    expertise: "RUBY",
                })
               .end((req, res)=>{
                    res.should.have.status(400);
                    res.body.should.have.property("error");
                    done();
               });
        });

        
        it("Should NOT create an account for a new user: User already exists", (done)=>{
            chai.request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "EUGENE",
                    lastName: "PARK",
                    email: "eugenepark@gmail.com",
                    password: "12345",
                    address: "KOREA",
                    bio: "RUBY STUDENT",
                    occupation: "STUDENT",
                    expertise: "RUBY",
                })
               .end((req, res)=>{
                    res.should.have.status(409);
                    res.body.should.have.property("message").equal("This account already exists.Try another one.");
                    done();
               });
        });
    });

    
    describe("POST/ Login into user account", ()=>{
        
        it("Should Login into user account", (done)=>{
            chai.request(app)
                .post(`/api/v1/auth/signin`)
                .send({
                    email: "dorothembarushimana@gmail.com",
                    password: "12345"
                })
               .end((req, res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property("message").equal("User is successfully logged in");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("token");
                    res.body.data.should.have.property("firstName");
                    res.body.data.should.have.property("lastName");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("address");
                    res.body.data.should.have.property("bio");
                    res.body.data.should.have.property("occupation");
                    res.body.data.should.have.property("expertise");
                    done();
               });
        });
        
        it("Should NOT Login into user account: Invalid Email or Password", (done)=>{
            chai.request(app)
                .post(`/api/v1/auth/signin`)
                .send({
                    email: "dorothembarushimana@gmail.com",
                    password: "12345909790"
                })
               .end((req, res)=>{
                    res.should.have.status(404);
                    res.body.should.have.property("error");
                    done();
               });
        });
        
        it("Should NOT Login into user account: Invalid or Insufficient input", (done)=>{
            chai.request(app)
                .post(`/api/v1/auth/signin`)
                .send({
                    email: "dorothembarushimana@gmail.com",
                })
               .end((req, res)=>{
                    res.should.have.status(400);
                    res.body.should.have.property("error");
                    done();
               });
        });
    });

    
    describe("PATCH/ Change a user to a mentor", ()=>{
        
        it("Should change a user into a mentor", (done)=>{
            const userId= 6;
            const user_token = {
                id: 1,
                firstName: "BRIGITE",
                lastName: "MUTONI",
                email: "mutonibrigitte@gmail.com",
                password: "12345",
                address: "BELGIUM",
                bio: "JAVASCRIPT ENTHUSIAST",
                occupation: "STUDENT",
                expertise: "NODEJS",
                isAdmin: true,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v1/user/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("message").equal("User account changed to mentor");
                        res.body.should.have.property("data");
                        res.body.data.should.be.an("object");
                        res.body.data.should.have.property("id");
                        res.body.data.should.have.property("firstName");
                        res.body.data.should.have.property("lastName");
                        res.body.data.should.have.property("email");
                        res.body.data.should.have.property("address");
                        res.body.data.should.have.property("bio");
                        res.body.data.should.have.property("occupation");
                        res.body.data.should.have.property("expertise");
                        res.body.data.should.have.property("isAdmin");
                        res.body.data.should.have.property("isAmentor");
                        done();
                });
        });

        
        it("Should NOT change a user into a mentor: userId not Found", (done)=>{
            const userId= 6000;
            const user_token = {
                id: 1,
                firstName: "BRIGITE",
                lastName: "MUTONI",
                email: "mutonibrigitte@gmail.com",
                password: "12345",
                address: "BELGIUM",
                bio: "JAVASCRIPT ENTHUSIAST",
                occupation: "STUDENT",
                expertise: "NODEJS",
                isAdmin: true,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v1/user/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("A mentee with such userId not found")
                        done();
                });
        });

        
        it("Should NOT change a user into a mentor: Only admin can change a user to a mentor", (done)=>{
            const userId= 6;
            const user_token = {
                id: 2,
                firstName: "AUGUSTIN",
                lastName: "NTAMBARA",
                email: "augustinntambara@gmail.com",
                password: "12345",
                address: "FRANCE",
                bio: "PYTHON ENTHUSIAST",
                occupation: "PROFESSOR",
                expertise: "PYTHON",
                isAdmin: false,
                isAmentor: true
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .patch(`/api/v1/user/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(400);
                        res.body.should.have.property("error").equal("Only Administrator can change a user to a mentor")
                        done();
                });
        });

        
        it("Should NOT change a user into a mentor: No token provided", (done)=>{
            const userId= 6;
            chai.request(app)
                .patch(`/api/v1/user/${userId}`)
                .end((req, res)=>{
                        res.should.have.status(403);
                        res.body.should.have.property("error").equal("Access denied. Token is required")
                        done();
                });
        });
    });

    
    describe("GET/ View all mentors", ()=>{
        
        it("Should view all mentors", (done)=>{
            const user_token = {
                id: 5,
                firstName: "DOROTHE",
                lastName: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                password: "12345",
                address: "ITALY",
                bio: "C# ENTHUSIAST",
                occupation: "ASSISTANT PROF",
                expertise: "C#",
                isAdmin: false,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v1/mentors`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });
    });

    
    describe("GET/ View a specific mentor by Id", ()=>{
        
        it("Should View a specific mentor by Id", (done)=>{
            const userId= 2;
            const user_token = {
                id: 5,
                firstName: "DOROTHE",
                lastName: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                password: "12345",
                address: "ITALY",
                bio: "C# ENTHUSIAST",
                occupation: "ASSISTANT PROF",
                expertise: "C#",
                isAdmin: false,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v1/mentors/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        done();
                });
        });

        
        it("Should NOT View a specific mentor by Id: A user with such Id not found", (done)=>{
            const userId= 20;
            const user_token = {
                id: 5,
                firstName: "DOROTHE",
                lastName: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                password: "12345",
                address: "ITALY",
                bio: "C# ENTHUSIAST",
                occupation: "ASSISTANT PROF",
                expertise: "C#",
                isAdmin: false,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v1/mentors/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("A user with such Id not found");
                        done();
                });
        });

        
        it("Should NOT View a specific mentor by Id: A mentor with such Id not found", (done)=>{
            const userId= 5;
            const user_token = {
                id: 5,
                firstName: "DOROTHE",
                lastName: "MBARUSHIMANA",
                email: "dorothembarushimana@gmail.com",
                password: "12345",
                address: "ITALY",
                bio: "C# ENTHUSIAST",
                occupation: "ASSISTANT PROF",
                expertise: "C#",
                isAdmin: false,
                isAmentor: false
            };
            const token =JWT.sign(user_token, process.env.SECRET);
            chai.request(app)
                .get(`/api/v1/mentors/${userId}`)
                .set('x-auth-token', token)
                .end((req, res)=>{
                        res.should.have.status(404);
                        res.body.should.have.property("error").equal("A mentor for this Id not found");
                        done();
                });
        });
    });
});
