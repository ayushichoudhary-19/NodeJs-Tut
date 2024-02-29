const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/nodejs-tut")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:: ", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "./log.txt",
    `\n${Date.now()}: ${req.ip} : ${req.method} : ${req.path}`,
    (err, data) => {
      if (!err) next();
    }
  );
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  })
  .patch(async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    await User.findByIdAndUpdate(
      id,
      {
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
      },
      { new: true }
    );

    return res.json({ status: "Successfully updated" });
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndDelete(id);

    return res.status(204).json({ message: `Deleted!}` });
  });

app.post("/api/users", async (req, res) => {
  //req.body gives everything that post sends
  const body = req.body;
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  return res.status(201).json({ msg: "success" });
});

app.listen(3000, () => {
  console.log("Server created successfully!");
});
