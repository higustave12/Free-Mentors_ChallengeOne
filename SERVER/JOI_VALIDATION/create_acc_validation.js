import Joi from '@hapi/joi';

const createAccountccountSchema= {
    firstName: (Joi.string().required()).replace(/\s/g,''),
    lastName: (Joi.string().required()).replace(/\s/g,''),
    email: (Joi.string().email({minDomainSegments : 2}).required()).replace(/\s/g,''),
    password: (Joi.string().required()).replace(/\s/g,''),
    address: (Joi.string().required()).replace(/\s/g,''),
    bio: (Joi.string().required()).replace(/\s/g,''),
    occupation: (Joi.string().required()).replace(/\s/g,''),
    expertise: (Joi.string().required()).replace(/\s/g,'')
};
export default createAccountccountSchema;