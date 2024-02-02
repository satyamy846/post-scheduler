import { IgApiClient } from 'instagram-private-api';
import Social from '../models/Social.js';
import CustomError from '../utilities/ErrorHandlers/CustomError.js';
import axios from 'axios';
import SOCIALHANDLER from '../constants/Variable.js';
import User from '../models/User.js'



export const postInstagram = async(req, res, next) =>{
    try{
            const userId = req.params.userId;
            const socialHandler = await Social.findOne({userId: userId});
            if(!socialHandler){
                next(new CustomError('No social handler found', 404));
            }

            const username = socialHandler.username;
            const password = socialHandler.password;
            // creating a client to connect ig api 
            const ig = new IgApiClient();
            ig.state.generateDevice(username);
            
            // log in to ig account
            await ig.account.login(username, password);
           
    
            const response = await axios.get("", {
                responseType: 'arraybuffer', // set the responseType to 'arraybuffer' for image data
            });

            const imageBuffer = Buffer.from(response.data, 'binary');

            const postImage = await ig.publish.photo({
                file: imageBuffer,
                caption: req.body.caption, // nice caption (optional)
            });

        res.status(200).json({
            message: `Post uploaded`
        })

    }
    catch(error){
        next(new CustomError(`Something went wrong`, 500));
    }
}

export const addInstaHandler = async (req, res, next) =>{
    try{
        
        const userId = req.params.userId;
        console.log("req =========== ", req);
        console.log("req body =========== ", req.body);
        console.log("req image=========== ", req.image);
        console.log("file -- ", req.file);
        console.log("image path = ", req.file.path);

        const data = {
            name: SOCIALHANDLER.INSTAGRAM,
            username: req.body.username,
            password: req.body.password,
            userId: userId,
            image: req.file.path
        }

        const socialHandler = await Social.create(data);
        console.log("socialHandler = ", socialHandler);
        const user = await User.findById({_id: userId});
        if(!user){
            return next(new CustomError('User not Found', 404));
        }

        await User.findOneAndUpdate({socialHandler:{$push: {name: SOCIALHANDLER.INSTAGRAM, socialId: socialHandler._id}}})
        res.status(200).json({
            message: "Social Handler added",
            social: socialHandler
        })

    }
    catch(error){
        next(new CustomError('Something went wrong while addingInstaHandler', 500));
    }
}