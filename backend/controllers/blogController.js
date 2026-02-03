import Blog from "../models/blogModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,

      metaTitle,
      metaDescription,
      canonicalUrl,

      ogTitle,
      ogDescription,
      twitterCard,

      tags,
      categories,
      faq,
      internalLinks,
      externalLinks,

      status,
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required",
      });
    }

    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // ---------- Cloudinary Upload ----------
    let ogImageUrl = null;
    let featureImageUrl = null;

    if (req.files?.ogImage) {
      const ogResult = await uploadToCloudinary(
        req.files.ogImage[0].buffer,
        "blogimages/og"
      );
      ogImageUrl = ogResult.secure_url;
    }

    if (req.files?.featureImage) {
      const featureResult = await uploadToCloudinary(
        req.files.featureImage[0].buffer,
        "blogimages/feature"
      );
      featureImageUrl = featureResult.secure_url;
    }

    const blog = await Blog.create({
      title,
      slug,
      content,

      metaTitle,
      metaDescription,
      canonicalUrl,

      ogTitle,
      ogDescription,
      ogImage: ogImageUrl,
      twitterCard,

      tags,
      categories,
      faq,
      internalLinks,
      externalLinks,

      featureImage: featureImageUrl,

      status: status || "draft",
      author: req.user._id,
      publishedAt: status === "published" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Blog creation failed",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({
      status: "published",
    });

    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      blogs,
      pagination: {
        totalBlogs,
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

   
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "superAdmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    // ---------- Image Replace ----------
    if (req.files?.ogImage) {
      const ogResult = await uploadToCloudinary(
        req.files.ogImage[0].buffer,
        "blogimages/og"
      );
      blog.ogImage = ogResult.secure_url;
    }

    if (req.files?.featureImage) {
      const featureResult = await uploadToCloudinary(
        req.files.featureImage[0].buffer,
        "blogimages/feature"
      );
      blog.featureImage = featureResult.secure_url;
    }

    Object.assign(blog, req.body);

    if (req.body.status === "published" && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Blog update failed",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name role");

      

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Ownership / SuperAdmin check
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "superAdmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    const extractPublicId = (url) => {
      if (!url) return null;
      return url
        .split("/")
        .slice(-3)
        .join("/")
        .replace(/\.[^/.]+$/, "");
    };

    // Delete OG Image
    if (blog.ogImage) {
      const ogPublicId = extractPublicId(blog.ogImage);
      if (ogPublicId) {
        await cloudinary.uploader.destroy(ogPublicId);
      }
    }

    // Delete Feature Image
    if (blog.featureImage) {
      const featurePublicId = extractPublicId(blog.featureImage);
      if (featurePublicId) {
        await cloudinary.uploader.destroy(featurePublicId);
      }
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Blog delete failed",
      error: error.message,
    });
  }
};

export const getDraftBlogs = async (req, res) => {
  try {
    let filter = { status: "draft" };

    if (req.user.role !== "superAdmin") {
      filter.author = req.user._id;
    }

    const drafts = await Blog.find(filter)
      .populate("author", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: drafts.length,
      drafts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch draft blogs",
    });
  }
};

export const publishBlog = async (req, res) => {
  try {
    if (!["editor", "superAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Publish not allowed",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.status = "published";
    blog.publishedAt = new Date();

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog published successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Publish failed",
      error: error.message,
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      author: req.user._id,
      status: req.query.status || "published",
    };

    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + blogs.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch my blogs",
    });
  }
};
