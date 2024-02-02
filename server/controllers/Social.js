import { IgApiClient } from 'instagram-private-api';
import Social from '../models/Social.js';
import CustomError from '../utilities/ErrorHandlers/CustomError.js';
import axios from 'axios';

const postToInsta = async (next)=>{
        try{
            const ig = new IgApiClient();
            ig.state.generateDevice(process.env.IG_USERNAME);
            
            await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
           
    
            const response = await axios.get('https://i.imgur.com/BZBHsauh.jpg', {
                responseType: 'arraybuffer', // set the responseType to 'arraybuffer' for image data
            });

            const imageBuffer = Buffer.from(response.data, 'binary');

            const postImage = await ig.publish.photo({
                file: imageBuffer,
                caption: 'Really nice photo from the internet!', // nice caption (optional)
            });
        }
        catch(err){
            return next(new CustomError('Something went wrong', 500));
        }
}

export const postInstagram = async(req, res, next) =>{
    try{
        
        postToInsta(next)
        res.status(200).json({
            message: `Post uploaded`
        })

    }
    catch(error){
        next(new CustomError(`Something went wrong`, 500));
    }
}