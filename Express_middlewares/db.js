const mongoose= require("mongoose");
const dotenv= require("dotenv");

dotenv.config();

const dbUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ibcnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbUrl)
    .then(function(connection){
        console.log("connected to db");
    }).catch(err => console.log(err));



