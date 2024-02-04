import { IgApiClient } from 'instagram-private-api';
import Social from '../models/Social.js';
import CustomError from '../utilities/ErrorHandlers/CustomError.js';
import axios from 'axios';
import SOCIALHANDLER from '../constants/Variable.js';
import User from '../models/User.js';
import { uploader } from '../config/CloudinaryConfig.js';
import cron, { schedule } from 'node-cron';

import {v2 as cloudinary} from 'cloudinary';
// const {cloudinary}  = require('cloudinary').v2;

async function postToInstagram(req,next,username, password){
    try{
        console.log("inside");
        // creating a client to connect ig api 
        const ig = new IgApiClient();
        // You must generate device id's before login.
        ig.state.generateDevice(username);

        // log in to ig account
        await ig.account.login(username, password);
        console.log("username and password", username," ", password);


        // convert the buffer file into binary
        const imageBuffer = Buffer.from(req.file.buffer, 'binary');
        // call the insta api to post the photo

        return await ig.publish.photo({
            file: imageBuffer,
            caption: req.body.caption, 
        });
    }
    catch(err){
        return next(new CustomError("Something went wrong while posting photo", 500));
    }
}


export const postInstagram = async (req, res, next) => {
    try {

        const userId = req.params.userId;
        // find the user's social handler i.e username and password
        const socialHandler = await Social.findOne({ userId: userId });
        if (!socialHandler) {
            return next(new CustomError(`No social handler found with this ${userId}`, 404));
        }
        const username = socialHandler.username;
        const password = socialHandler.password;

        try{
            let upload_id = "";
            let status;
            let second = req.body.second || "";
            let minute = req.body.minute || "";
            let hour = req.body.hour || "";
            let date = req.body.date || "";
            let month = req.body.month || "";
            let day = req.body.day || "";
            let year = req.body.year || "";
            var cronJob = new cron.schedule(`${minute} ${hour} * * *`, async ()=>{

                const {upload_id, status} = await postToInstagram(req, next, username, password);
                // upload_id = upload_id;
                // status = status;
                // console.log("yes")
            })

            cronJob.start();
            res.status(200).json({
                message:"Post is scheduled",
            })
        }
        catch(err){
            // cronJob.stop();
            console.log("err", err);
            return next(new CustomError("Something went wrong while uploading", 500));
            // console.log("error= ", err);
        }

    }
    catch (error) {
        console.log(error);
        next(new CustomError(`Something went wrong`, 500));
    }
}

export const addInstaHandler = async (req, res, next) => {
    try {

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
        const user = await User.findById({ _id: userId });
        if (!user) {
            return next(new CustomError('User not Found', 404));
        }

        await User.findOneAndUpdate({ socialHandler: { $push: { name: SOCIALHANDLER.INSTAGRAM, socialId: socialHandler._id } } })
        res.status(200).json({
            message: "Social Handler added",
            social: socialHandler
        })

    }
    catch (error) {
        next(new CustomError('Something went wrong while addingInstaHandler', 500));
    }
}