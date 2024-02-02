import express, { urlencoded } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {mongooseConnection} from './config/MongooseConnection.js';
import CustomError from './utilities/ErrorHandlers/CustomError.js';
import globalErrorResponse from './utilities/ErrorHandlers/GlobalErrorResponse.js';
import userRoute from './routes/User.js';
import socialRoute from './routes/Social.js';
import multer from 'multer';
import path from 'path';
dotenv.config();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cors({ origin: "*"}));


app.get("/", (req, res) =>{
    res.send(`Server is running`)
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
    }
});



app.use(multer({ storage: storage }).single("image"));

/**
 * Routes
 */

app.use(userRoute);
app.use(socialRoute);

mongooseConnection();

// app.all("*", (req, res, next)=>{
//     const err = new CustomError(`Can't find  ${req.originalUrl} on this server!`, 404);
//     next(err);
// });


// app.use("./uploads", express.static(path.join(__dirname, "uploads")));

app.use(globalErrorResponse);

let PORT = process.env.SERVER_PORT || 5000;


app.listen(PORT, function(){
    console.log(`Server is running http://localhost:${PORT}`);
});