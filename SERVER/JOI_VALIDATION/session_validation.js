import Joi from '@hapi/joi';

const session_schema={
    mentorId: Joi.number().integer().required(),
    questions: Joi.string().required()
};

export default session_schema;