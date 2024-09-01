const path = require('path');

// Global variables
console.log("Current folder:", __dirname);
console.log("Current file:", __filename);

const directoryPath = path.dirname(__filename);
console.log("Directory Path:", directoryPath);

const fileExt = path.extname(__filename);
console.log("File Extension:", fileExt);

const pathToMyFile= path.join(__dirname,"../","../","CSS","css-notes.md");
console.log(pathToMyFile);