# Free Mentors
Free Mentors is a social initiative where accomplished professionals become role models to young people to provide free mentorship sessions.

## Features
* Users can sign up
* Users can sign in
* Admin can change a user to a mentor
* Users can view mentors
* Users can view a specific mentor
* Users can create a mentorship session request with a mentor
* A mentor can accept a mentorship session request
* A mentor can decline a mentorship session request
* Users can view all their mentorship sessions
* Users can review a mentor after a mentorship session
* Admin can delete a review deemed as inappropriate

## Pivotal Tracker stories
* PT board link: (https://www.pivotaltracker.com/n/projects/2379750)

## UI Template
* use this link to access the UI templates  https://higustave12.github.io/Free-Mentors_ChallengeOne/

## Swagger documentation
* Swagger documentatoion link:  https://adc-10.herokuapp.com/freementors/

## Installation(Tools)
* Text Editor: Visual Studio
* Node/Express
* Postman
* POSTGRESQL

## SetUp Project to get Started
* Clone this repo 
* install all dependencies using 
```npm install```
* Start Server 
```npm run dev```
* Run Postman to check API Endpoints on 
```localhost:3000``` 
## (.env) file sample(Note: The following are just samples for your reference)
* SECRET="gaahdjijhdshgygsd537bhwevt!jhbvsc"
* DATABASE_URL= url (Note: put the correct postgresql database url)

## Methods and paths to test API Endpoints

| Method      | Path                                                           | Description                          |
|-------------|----------------------------------------------------------------|--------------------------------------|
| POST        | /api/v1/auth/signup                                            | Create User Account                  |
| POST        | /api/v1/auth/signin                                            | User login                           |
| PATCH       | /api/v1/user/:userId                                           | Change a user to a mentor            |
| GET         | /api/v1/mentors                                                | Get all mentors                      |
| GET         | /api/v1/mentors/:mentorId                                      | Get a specific mentor                |
| POST        | /api/v1/sessions                                               | Create a mentorship session request  |
| PATCH       | /api/v1/sessions/:sessionId/accept                             | A mentor accepts a session request   |
| PATCH       | /api/v1/sessions/:sessionId/reject                             | A mentor rejects a session request   |
| GET         | /api/v1/sessions                                               | Get all mentorship session requests  |
| POST        | /api/v1/sessions/:sessionId/review                             | Review a finished mentorship session |
| DELETE      | /api/v1/sessions/:sessionId/review                             | Delete inappropriate session review. |

## Technologies Used

### Bank-End
* Node / Express js
* Express
* Joi
* ESLint
* Travis CI
* Code Climate & Coveralls

### Front-End
* HTML
* CSS
* JavaScript

## Author: Gustave HARINTWARI 
