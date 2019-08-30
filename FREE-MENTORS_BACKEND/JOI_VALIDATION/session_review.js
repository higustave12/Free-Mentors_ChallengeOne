import Joi from '@hapi/joi';

const session_review_schema={
    score: Joi.number().integer().min(1).max(5).required(),
    remark: Joi.string().required()
};

export default session_review_schema;