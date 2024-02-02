import User from '../models/User.js';
import CustomError from '../utilities/ErrorHandlers/CustomError.js';

export const addUser = async (req, res, next) =>{
    try{
        

        const user = await User.create(req.body);
        if(!user){
            return next(new CustomError("Somethig went wrong", 500));
        }
        res.status(200).json({
            message: "User is created",
            user: user
        })
    }
    catch(error){
        next(new CustomError('Cannot add user', 500));
    }
}