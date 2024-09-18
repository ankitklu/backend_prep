const MovieModel = require("../models/movieModels");

const createMovie= async function (req, res){
    try{
        const movieObject= req.body;
        const user= await MovieModel.create(movieObject);
        res.status(201).json(user);
    }
    catch(err){
        res.status(500).json({
            message: "Internal Server error",
            error: err
        })
    }
}

const getAllMovie= async (req,res)=>{
    try{
        const movie= await MovieModel.find();
        if(movie.length!=0){
            res.status(200).json({
                message: movie
            })
        }
        else{
            res.status(404).json({
                message: "Did not find movie"
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

const getMovie= async(req, res)=>{
    try{
        const id = req.params.id;
        const movie= await MovieModel.findById(id);
        if(movie){
            if(movie.confirmPassword){
                movie.confirmPassword=undefined;
            }
            res.status(200).json({
                message: movie
            })
        }
        else{
            res.staus(201).json({
                message: "movie not found"
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

const deleteMovie= async(req,res)=>{
    try{
        let {id}=  req.params;
        const movie= await MovieModel.findByIdAndDelete(id);
        if(movie===null){
            res.status(404).json({
                status:"success",
                message: "movie does not exists"
            })
        }
        else{
            res.status(200).json({
                status: "success",
                message: "movie is deleted",
                movie:movie
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


module.exports= {
    createMovie,
    getAllMovie,
    getMovie,
    deleteMovie
}