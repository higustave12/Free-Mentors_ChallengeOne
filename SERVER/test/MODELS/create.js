import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool= new Pool({
    connectionString: process.env.DATABASE_URL
});

export const createAlltables=()=>{
    const allTables= `CREATE TABLE IF NOT EXISTS 
    users(
        userid SERIAL,
        firstname varchar(255) NOT NULL,
        lastname varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        address varchar(255) NOT NULL,
        bio varchar(255) NOT NULL,
        occupation varchar(255) NOT NULL,
        expertise varchar(255) NOT NULL,
        is_admin BOOLEAN,
        is_a_mentor BOOLEAN,
        PRIMARY KEY (userid)
    );

    CREATE TABLE IF NOT EXISTS 
    sessions(
        sessionid SERIAL,
        mentorid int NOT NULL,
        menteeid int NOT NULL,
        questions varchar(255) NOT NULL,
        menteeemail varchar(255) NOT NULL,
        status varchar(255) NOT NULL,
        score int,
        menteefullname varchar(255),
        remark varchar(255),
        PRIMARY KEY (sessionid),
        FOREIGN KEY (mentorid) REFERENCES users (userid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
    
    INSERT INTO users(firstname, lastname, email, password, address, bio, occupation, expertise, is_admin, is_a_mentor) 
    VALUES ('BRIGITTE','MUTONI','mutonibrigitte@gmail.com','12345','BELGIUM','JAVASCRIPT PROGRAMMER','PROGRAMMER','JAVASCRIPT','true','false');

    INSERT INTO users(firstname, lastname, email, password, address, bio, occupation, expertise, is_admin, is_a_mentor) 
    VALUES ('AUGUSTIN','NTAMBARA','augustinntambara@gmail.com','12345','FRANCE','PYTHON PROFESSOR','PROFEESSOR','PYTHON','false','true');

    INSERT INTO users(firstname, lastname, email, password, address, bio, occupation, expertise, is_admin, is_a_mentor) 
    VALUES ('FIDELE','BIZIMANA','fidelebizimana@gmail.com','12345','KIGALI-RWANDA','RUBY ASSISTANT PROFESSOR',' ASSISTANT PROFEESSOR','RUBY','false','true');

    INSERT INTO users(firstname, lastname, email, password, address, bio, occupation, expertise, is_admin, is_a_mentor) 
    VALUES ('PAUL','NSABIMANA','paulnsabimana@gmail.com','12345','KIGALI-RWANDA','C++ PROFESSOR','PROFEESSOR','C++','false','true');

    INSERT INTO users(firstname, lastname, email, password, address, bio, occupation, expertise, is_admin, is_a_mentor) 
    VALUES ('DOROTHE','MBARUSHIMANA','dorothembarushimana@gmail.com','12345','KIGALI-RWANDA','C# STUDENT','STUDENT','C#','false','false');`

    pool.query(allTables)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err);
            pool.end()
        });
};

export default pool;
require('make-runnable');

