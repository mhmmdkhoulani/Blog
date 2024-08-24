const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.protect = async (req, res, next) => {
  //Check if there is jwt
  try {
    const authentication = req.headers.authentication;
    if (!authentication) {
      return res.status(401).send("No jwt");
    }
    const token = authentication.split(" ")[1];
    const decoded = jwt.verify(token, "this-is-best-secret-key");
    const user = await User.findById(decoded.id).select("+isActive");
    if (!user) {
      return res.status(401).send({ status: "fail", message: "user deleted" });
    }
    if (!user.isActive) {
      return res.status(401).send({ status: "fail", message: "user inactive" });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};
