import userLoginSchema from '../JOI_VALIDATION/login_user_validation';
import Joi from '@hapi/joi';

class userLoginValidation{
    static validateLogin(req, res, next){
        const { email, password } = req.body;
        const loginUserValidationVal = Joi.validate(req.body, userLoginSchema);
        if (loginUserValidationVal.error) {
            const loginErrors = [];
            for (let j = 0; j < loginUserValidationVal.error.details.length; j++) {
                loginErrors.push(loginUserValidationVal.error.details[j].message.split('"').join(" "));
            }
            return res.status(400).send({
                status: 400,
                error: loginErrors[0]
            });
        }
        next();
    }
}
export default userLoginValidation;