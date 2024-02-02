import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },
    email:{
        type: String,
        unique:[true, 'Email must be unique']
    },
    password:{
        type: String,

    },
    phone: {
        type: String,
        required: [true, 'Phone cannot be empty'],
        unique:[true, 'Phone should be unique']
    },
    socialHandlers:[{
        socialId:  { 
            type: String,
        },
    }]
});

const User = new mongoose.model("user", userSchema);

export default User;