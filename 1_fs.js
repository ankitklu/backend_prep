//fs module to be imported to do the operation
const fs= require("fs");

let where_to_create_file= "file1.txt";

let content= "Content added using asynchronous method";

//synchronous version
// console.log("Adding Content to the file");
// fs.writeFileSync(where_to_create_file,content);
// console.log("Content Added");

//asynchronous version
// console.log("Before");
// fs.writeFile(where_to_create_file,content,function(err,data){       
//     if(err){
//         console.log("Something went wrong");
//     }
//     else{
//         console.log("File written ");
//     }
// });
// console.log("After");     


//READ A FILE
let contentOfFile= fs.readFileSync(where_to_create_file);
console.log("Contnent: "+ contentOfFile);