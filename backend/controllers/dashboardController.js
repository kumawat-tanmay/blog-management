import Blog from "../models/blogModel.js";
import userModel from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    // 📌 Published blogs (system-wide)
    const totalBlogs = await Blog.countDocuments({
      status: "published",
    });

    // 📌 Draft blogs (system-wide)
    const totalDrafts = await Blog.countDocuments({
      status: "draft",
    });

    // 📌 User specific
    const myBlogs = await Blog.countDocuments({
      author: userId,
      status: "published",
    });

    const myDrafts = await Blog.countDocuments({
      author: userId,
      status: "draft",
    });

    let stats = {};

    // 👑 SUPER ADMIN
    if (role === "superAdmin") {
      const totalUsers = await userModel.countDocuments();

      stats = {
        totalUsers,
        totalBlogs,
        totalDrafts,
        myBlogs,
        myDrafts,
      };
    }

    // ✍️ EDITOR
    if (role === "editor") {
      stats = {
        totalBlogs,
        myBlogs,
        myDrafts,
      };
    }

    // 📝 AUTHOR
    if (role === "author") {
      stats = {
        totalBlogs,
        myBlogs,
        myDrafts,
      };
    }

    // 👀 VIEWER
    if (role === "viewer") {
      stats = {};
    }

    return res.status(200).json({
      success: true,
      role,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
