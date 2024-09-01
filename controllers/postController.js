const Post = require("../models/postModel");
const User = require("../models/user");
const Comment = require("../models/commentModel");
const Like = require("../models/likeModel");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res
      .status(200)
      .send({ status: "success", result: posts.length, data: posts });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.createComment = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const commentData = { ...req.body, user: userId, post: postId };
  try {
    const comment = await Comment.create(commentData);
    const post = await Post.findById(postId);
    post.commentsCount += 1;
    await post.save();
    return res.status(201).send({ status: "success", data: comment });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const id = req.user._id;
  const postData = { ...req.body, user: id };
  try {
    const post = await Post.create(postData);
    return res.status(201).send({ status: "success", data: post });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;
  let message;
  try {
    const like = { user: userId, post: postId };
    const isLiked = await Like.findOne(like);

    const post = await Post.findById(postId);
    if (!isLiked) {
      await Like.create(like);
      post.likes += 1;
      message = "Post Liked";
    } else {
      await Like.findByIdAndDelete(isLiked._id);
      post.likes -= 1;
      message = "Post Unliked";
    }
    await post.save();

    return res.status(201).send({ status: "success", message: message });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;
  try {
    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (comment.user.toString() !== user._id.toString()) {
      if (user.role != "admin") {
        return res.status(401).send({
          status: "fail",
          message: "You are not authorized to delete this comment",
        });
      }
    }
    const post = await Post.findById(comment.post);
    post.commentsCount -= 1;
    await post.save();
    await comment.deleteOne();

    return res
      .status(200)
      .send({ status: "success", message: "Comment deleted successfully!" });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;
  try {
    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(401).send({
        status: "fail",
        message: "You are not authorized to edit this comment",
      });
    }
    comment.content = req.body.content;
    await comment.save();

    return res
      .status(200)
      .send({ status: "success", message: "Comment updated successfully!" });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};
exports.updatePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .send({ status: "success", message: "Post not found" });
    if (post.user.toString() != userId.toString())
      res.status(401).send({ status: "success", message: "Unauthorized" });
    const updatePost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).send({ status: "success", data: updatePost });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .send({ status: "fail", message: "Post not found" });
    if (post.user.toString() != userId.toString()) {
      if (req.user.role != "admin") {
        return res
          .status(401)
          .send({ status: "fail", message: "Unauthorized" });
      }
    }
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });

    await post.deleteOne();
    return res.status(204).send("Deleted!");
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  const userId = req.params.userId || req.user._id;

  try {
    const posts = await Post.find({ user: userId });
    return res
      .status(200)
      .send({ status: "success", result: posts.length, data: posts });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};
