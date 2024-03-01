const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const users = await User.find({});
  return res.json(users);
}

async function handleGetUserById(req, res) {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
}

async function handleUpdateUserById(req, res) {
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
}

async function handleDeleteUserById(req, res) {
  const id = req.params.id;
  await User.findByIdAndDelete(id);

  return res.status(204).json({ message: `Deleted!}` });
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  return res.status(201).json({ msg: "success", id: result._id });
}
module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
