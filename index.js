const fs = require('fs');
const users = require("./MOCK_DATA.json");
const express = require("express");
const app = express();



app.use(express.urlencoded({extended:false}));

app.use((req,res,next) => {
    fs.appendFile('./log.txt',`\n${Date.now()}: ${req.ip} : ${req.method} : ${req.path}`, (err,data) =>{
      if(!err) next();
    })
})

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/api/users", (req, res) => {
    res.json(users);
  });
  
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id===id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    const body = req.body;

    if(body.first_name) user.first_name = body.first_name;
    if(body.last_name)  user.last_name = body.last_name;
    if(body.email) user.email = body.email;
    if(body.gender) user.gender = body.gender;
    if(body.job_title) user.job_title = body.job_title;
    users[id] = user;
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err)=>{
      return res.json(user);
    })
  }).delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    users.splice(userIndex, 1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(204).json({message: `Deleted!}`});
    });
});


app.post("/api/users", (req, res) => {
    //req.body gives everything that post sends
    const body = req.body;
    users.push({id: users.length+1,...body});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users), (err,data)=>{
        return res.status(201).json({status:'done'}); })
    });

app.listen(3000, () => {
  console.log("Server created successfully!");
});
