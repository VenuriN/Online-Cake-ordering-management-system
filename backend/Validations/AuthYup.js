import * as yup from 'yup'

class AuthYup {
    registerSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().min(8).required(),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
        email: yup.string().email().required(),
    })
    loginSchema = yup.object({
        password: yup.string().required(),
        email: yup.string().required(),
        role: yup.string().required(),
    })
    passwordReset = yup.object({
        email:yup.string().email().required()
    })
    verifyPasswordReset = yup.object({
        password:yup.string().min(8).required()
    })

    updateUserSchema = yup.object({
        username: yup.string().required(),
        email: yup.string().email().required(),
        // Add more fields as needed
    })
}

export default AuthYup = new AuthYup()