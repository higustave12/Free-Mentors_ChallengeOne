import Joi from '@hapi/joi';

const create_acc_schema= {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: (Joi.string().email({minDomainSegments : 2}).required()).replace(/\s/g,''),
    password: Joi.string().required(),
    address: Joi.string().required(),
    bio: Joi.string().required(),
    occupation: Joi.string().required(),
    expertise: Joi.string().required()
};
export default create_acc_schema;