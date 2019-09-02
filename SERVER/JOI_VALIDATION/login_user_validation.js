import Joi from '@hapi/joi';

const login_schema= {
    email: (Joi.string().email({minDomainSegments : 2}).required()).replace(/\s/g,''),
    password: Joi.string().required()
};
export default login_schema;