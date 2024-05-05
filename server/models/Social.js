import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },
    username:{
        type: String,
        unique: [true, 'Username must be unique']
    },
    password:{
        type: String,
    },
    userId:{
        type: String,
        required: [true, 'User Id must be provided']
    },
    image:{
        type: String,
    }
});

const Social = new mongoose.model("social", socialSchema);

export default Social;