const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/user");
const ApiError = require("../utils/apiError");
exports.getAllPosts = async () => {
  const posts = await Post.find();
  return posts;
};

exports.createComment = async (commentData) => {
  try {
    const post = await getPostById(commentData.post);
    const comment = await Comment.create(commentData);
    post.commentsCount += 1;
    await post.save();
    return comment;
  } catch (error) {
    throw error;
  }
};

exports.deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (comment.user.toString() !== user._id.toString()) {
      if (user.role != "admin") {
        throw new ApiError(
          "You are not authorized to delete this comment",
          401
        );
      }
    }
    const post = await getPostById(comment.post);
    post.commentsCount -= 1;
    await post.save();
    await comment.deleteOne();
  } catch (error) {
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError("Post not found!", 404);
    }
    return post;
  } catch (error) {
    throw error;
  }
};
exports.sayHello = async () => {
  try {
    throw new ApiError("This is from new Api Error class", 500);
  } catch (error) {
    throw error;
  }
};
