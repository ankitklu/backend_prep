const express= require("express");
const mongoose= require("mongoose");
const app= express();
app.use(express.json());

const schemaRules={
    name:{
        type: String,
        required: [true,"Name is required"],
    },
    email:{
        type: String,
        required: true,
        unique: [true,"Email should be unique"]
    }, 
    password:{
        type: String,
        required: true,
        minLength: [6,"Password should be of length 6 or more"],
    },
    confirmPassword:{
        type: String,
        required: true,
        //custom validation to check whether the "congirmPassword" is same as that of "password"
        validate: [function(){
            return this.password==this.confirmPassword;
        },"Enter the exact password u entered earlier"],
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    isPremium:{
        type: String,
        deafult: false
    },
    role:{
        type: String,
        enum: ["user", "admin", "feed curator"],   //usecase is a string can be anything for this validation but is it a valid String defines the role of enum
        default: "user"
    }
}

const userSchema = new mongoose.Schema(schemaRules);

app.prependListener("save",function(next){
    this.confirmPassword= undefined;
    next();
});

const UserModel =mongoose.model("User",userSchema);

module.exports= UserModel;