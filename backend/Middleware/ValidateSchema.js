import response from "../Utils/ResponseHandler/ResponseHandler.js";


function validateSchema(schema){
    return async function(req,res,next){
        try {
            const body = req.body
            await schema.validate(body)
            next();
        } catch (error) {
            return response(res,400,{message:error.message})
        }
    }
}
export default validateSchema;