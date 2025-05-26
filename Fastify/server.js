import Fastify from "fastify"

import userRouter from "./src/routes/user.js"
import fastifyMongodb from "@fastify/mongodb";
import { configDotenv } from "dotenv";

configDotenv(); // Load environment variables from .env file

// create instance for fastify

const fastify = new Fastify({
    logger: true,
});

fastify.register(fastifyMongodb,{
    forceClose: true, // Close the connection when the server stops
    url:process.env.DB_URL, // Replace with your MongoDB connection string
})

fastify.register(userRouter);

fastify.get("/",(req, reply)=>{
    return {
        message: "Welcome to Auth service",
    };

});

const start = async ()=>{
    const PORT = process.env.PORT || 4000;
    try{
        await fastify.listen({ port: PORT });
        console.log(`Server listening on port ${PORT}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();