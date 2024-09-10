const express= require("express");
const app= express();
const cookieParser= require("cookie-parser");
app.use(cookieParser());

app.get("/", function(req, res){
    console.log("Get request recieved");
    res.cookie("Previous Page", "home", {
        maxAge: 1000*60*60*24, //defines the expiry date of the cookie
    })
    res.status(200).json({
        message: "Recieved req onhome page"
    })
})

//2nd visit
app.get("/product", function(req, res){
    console.log("The cookie is recieved with name as: ", req.cookies);
    res.status(200).json({
        message: "/product route fetched and recieved on product page"
    })
})

app.listen(3000, function(){
    console.log("The server is running at port no 3000");
})