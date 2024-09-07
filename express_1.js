const fs = require("fs");
const express = require("express");
const content = fs.readFileSync("data.json", "utf-8"); // Ensure encoding is set
const jsonPosts = JSON.parse(content);

const app = express();

function getHandler(req, res) {
    const postData = {
        name: "Ankit",
        id: "2200032823"
    };
    res.status(200).json(postData);
}

function getPostById(req, res) {
    const postId = req.params.id;
    console.log("Post ID:", postId);

    // jsonPosts is already an array
    const post = jsonPosts.find(p => p.id === postId);

    if (post) {
        return res.status(200).json({
            post: post,
        });
    } else {
        return res.status(404).json({
            post: "Post not found"
        });
    }
}

app.get("/post/:id", getPostById);
app.get("/post", getHandler);

app.listen(3000, function() {
    console.log("Server is running at port 3000");
});
