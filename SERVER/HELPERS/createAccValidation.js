import Joi from '@hapi/joi';
import createAccountccountSchema from '../JOI_VALIDATION/create_acc_validation';

class validateAccCreation{
    static userRegisterValidate(req, res, next){
        const { firstName, lastName, email, password, address, bio, occupation, expertise } = req.body;
        const create_acc_validation = Joi.validate(req.body, createAccountccountSchema);
        if (create_acc_validation.error) {
            const signup_errors = [];
            for (let i = 0; i < create_acc_validation.error.details.length; i++) {
                signup_errors.push(create_acc_validation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: signup_errors[0]
            });
        } 
        next();
    }
}

export default validateAccCreation;