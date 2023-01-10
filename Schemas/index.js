const Joi = require ('joi')

const customerSchema = (input) => {

    const schema = Joi.object({
        fullname: Joi.string().required(),
        username: Joi.string().alphanum().min(5).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        // repeat_password: Joi.ref('password'),
        phone: Joi.number().integer().required(),
        birthYear: Joi.number().integer().min(1930).required(),
        country: Joi.string().required(),
        email: Joi.string().email().required()
    })

    return schema.validate(input)
}


module.exports = customerSchema