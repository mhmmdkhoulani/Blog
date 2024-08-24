const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.singup = async (req, res) => {
  const body = req.body;
  try {
    if (body.password !== body.confirmPassword) {
      return res
        .status(500)
        .send({ status: "fail", message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    console.log(hashedPassword);
    body.password = hashedPassword;
    const user = await User.create(body);
    res.status(201).send({ status: "success", data: user });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.login = async (req, res) => {
  const body = req.body;
  try {
    if (!body.email || !body.password) {
      return res
        .status(400)
        .send({ status: "fail", message: "Provide email and password" });
    }
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res
        .status(400)
        .send({ status: "fail", message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ status: "fail", message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, "this-is-best-secret-key", {
      expiresIn: "10d",
    });

    res.status(200).send({ status: "success", token: token });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};
