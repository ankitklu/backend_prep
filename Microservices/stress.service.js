const express= require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.get("/stress-test", (req,res)=>{

    for(let i=0;i<1000000000;i++){
        
    }

    res.send("Hello World");
})

app.listen(3002, ()=>{
    console.log("Server running on porrt http://localhost:3002")
})
