const fs= require("fs");

const topics=["intro to backend dev with node.js","Intro to express and postman", "MongoDB and Mongoose", "MVC architecture and REST API", "Data validation and hooks in mongoose"];

for(let i=0;i<topics.length;i++){
    
    //topic name

    //create folder
    const currentFolder= `Lecture-${i+1}-${topics[i]}`;
    fs.mkdirSync(currentFolder);
    console.log("Created folder: "+ currentFolder);

    //write files inside each folder
    let filePath = `${currentFolder}/readme.md`;
    fs.writeFileSync(filePath,"#Agenda");



}
