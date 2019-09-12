import Joi from '@hapi/joi';

const session_review_schema={
    score: Joi.number().integer().min(1).max(5).required(),
    remarks: Joi.string().trim().required().replace(/\s/g,'')
};

export default session_review_schema;