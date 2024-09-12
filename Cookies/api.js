const express= require("express");
const app= express();
const cookieParser= require("cookie-parser");
app.use(cookieParser());

app.get("/", function(req, res){
    console.log("Get request recieved");
    res.cookie("prevpage", "home", {
        maxAge: 1000*60*60*24, //defines the expiry date of the cookie
    })
    res.status(200).json({
        message: "Recieved req on home page"
    })
})

//2nd visit
app.get("/product", function(req, res){
    console.log("The cookie is recieved with name as: ", req.cookies);
    let messageStr=""
    if(req.cookies && req.cookies.prevpage){
        messageStr+="Cookies from previous page"
    }
    else{
        messageStr+="No previous page found"
    }
    res.status(200).json({
        message: messageStr
    })
})

//remove cookies
app.get("/removeCookie", function(req,res){
    console.log("Removign cookie...");
    res.clearCookie('prevpage',{path:"/"});
    res.status(200).json({
        message: "I have cleared your cookie"
    })
})


app.listen(3000, function(){
    console.log("The server is running at port no 3000");
})