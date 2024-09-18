const UserModel = require("../models/userModel");


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
        res.status(500).json({
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



module.exports = {
    createUser,
    getAllUser,
    getUserById,
    deleteUser
}
