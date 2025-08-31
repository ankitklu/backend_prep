const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    return res.json({message : "Hello ANkit, you will crack a good offer soon !!"});;
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});