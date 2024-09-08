const express = require("express");
const app= express();


// function beforeFn(req,res,next){
//     console.log("Before Fn");
//     next();
// }

// function afterFn(req,res){
//     console.log("After function");
//     res.status(200).json({
//         body: "After function",
//         name: "Arpit"
//     })
// }

function validateInput(req, res, next){
    const len= Object.keys(req.body).length;
        if(len>0 && req.body.name && req.body.userid){
            const fullname= req.body.name;
            const newName= fullname.split(" ");
            req.body.firstName= newName[0];
            req.body.secName= newName[1];
            req.body.surname= newName[2];
            next();
        }
        else{
            res.status(400).json({
                message: "Invalid inputssss",
            })
        }
}

function nextValidate(req, res){
    console.log("After function is called");
    console.log("Request body: ", req.body);
    res.status(200).json({
        message: "Respond sent",
        body: req.body
    })
}


app.use(express.json());
app.post("/posts", validateInput);
app.post("/posts", nextValidate);

app.listen(3000, function(req,res){
    console.log("App is running at port no 3000");
});