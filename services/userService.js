const Post = require("../models/postModel");
const User = require("../models/user");
const ApiError = require("../utils/apiError");

exports.getPosts = (userId) => {
  try {
    return Post.find({ user: userId });
  } catch (error) {
    throw error;
  }
};
