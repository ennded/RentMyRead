const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required
    },
    email:{},
    password:{},
    role:{},
    createdAt:{},


})