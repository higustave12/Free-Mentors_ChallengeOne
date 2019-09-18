import Joi from '@hapi/joi';

const userLoginSchema= {
    email: (Joi.string().email({minDomainSegments : 2}).required()).replace(/\s/g,''),
    password: (Joi.string().required()).replace(/\s/g,'')
};
export default userLoginSchema;