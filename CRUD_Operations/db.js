const express= require("express");
const app= express();
const mongoose= require("mongoose");
const dotenv= require("dotenv");

dotenv.config();

const dbUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ibcnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbUrl)
    .then(function(connection){
        console.log("connected to db");
    }).catch(err => console.log(err));


//user-> Jio Cinema
const schemaRules={
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 10,
    },
    confirmPassword:{
        type: String,
        required: true,
        //custom validation to check whether the "congirmPassword" is same as that of "password"
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
const UserModel =mongoose.model("User",userSchema);

app.use(express.json()); //middlewares

app.post("/user",async function (req, res){
    try{
        const userObject= req.body;
        const user= await UserModel.create(userObject);
        res.status(201).json(user);
    }
    catch(err){
        res.status(500).json({
            message: "Internal Server error",
            error: err
        })
    }
})

app.listen(3000, function(req, res){
    console.log("Server started at port no 3000");
    
})



