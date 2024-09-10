const express= require("express");
const app= express();
const mongoose= require("mongoose");
const dotenv= require("dotenv");
app.use(express.json()); //middlewares

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





const createUser= async function (req, res){
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
}

const getAllUser= async (req,res)=>{
    try{
        const user= await UserModel.find();
        if(user.length!=0){
            res.status(200).json({
                message: user
            })
        }
        else{
            res.status(404).json({
                message: "Did not find user"
            })
        }
    }
    catch(err){
        res.status(500).josn({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const getUserById= async(req, res)=>{
    try{
        const id = req.params.id;
        const user= await UserModel.findById(id);
        if(user){
            if(user.confirmPassword){
                user.confirmPassword=undefined;
            }
            res.status(200).json({
                message: user
            })
        }
        else{
            res.staus(201).json({
                message: "user not found"
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const deleteUser= async(req,res)=>{
    try{
        let {id}=  req.params;
        const user= await UserModel.findByIdAndDelete(id);
        if(user===null){
            res.status(404).json({
                status:"success",
                message: "User does not exists"
            })
        }
        else{
            res.status(200).json({
                status: "success",
                message: "User is deleted",
                user:user
            })
        }
    }
    catch(err){
        res.status(500).json({
            message : "Internal Server Error",
            error: err.message
        })
    }
}


app.post("/user",createUser);
app.get("/user",getAllUser);
app.get("/user/:id", getUserById);
app.delete("/user/:id", deleteUser);

app.listen(3000, function(req, res){
    console.log("Server started at port no 3000");
    
})



