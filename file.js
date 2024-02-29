const fs = require("fs");

// fs.writeFileSync('./text.txt','Hey there!');

const result = fs.readFileSync('./text.txt','utf-8');
console.log(result);