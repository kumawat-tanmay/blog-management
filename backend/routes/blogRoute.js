import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getDraftBlogs,
  publishBlog,
  getMyBlogs,
} from "../controllers/blogController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/* ================= CREATE BLOG ================= */
// POST /api/blogs
router.post(
  "/",
  protect,
  authorizeRoles("author", "editor", "superAdmin"),
  upload.fields([
    { name: "ogImage", maxCount: 1 },
    { name: "featureImage", maxCount: 1 },
  ]),
  createBlog
);

/* ================= PUBLIC BLOGS ================= */
// GET /api/blogs (published only)
router.get("/", getAllBlogs);

/* ================= DRAFT BLOGS ================= */
// GET /api/blogs/drafts
router.get("/drafts", protect, getDraftBlogs);

/* ================= BLOG BY ID (ADMIN / EDIT) ================= */
// GET /api/blogs/id/:id
router.get("/id/:id", protect, getBlogById);

/* ================= UPDATE BLOG ================= */
// PUT /api/blogs/:id
router.put(
  "/:id",
  protect,
  authorizeRoles("author", "editor", "superAdmin"),
  upload.fields([
    { name: "ogImage", maxCount: 1 },
    { name: "featureImage", maxCount: 1 },
  ]),
  updateBlog
);

/* ================= PUBLISH BLOG ================= */
// PATCH /api/blogs/:id/publish
router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("editor", "superAdmin"),
  publishBlog
);

/* ================= DELETE BLOG ================= */
// DELETE /api/blogs/:id
router.delete(
  "/delete/:id",
  protect,
  authorizeRoles("author", "superAdmin"),
  deleteBlog
);
router.get(
  "/my",
  protect,
  authorizeRoles("author", "editor", "superAdmin"),
  getMyBlogs
);
/* ================= BLOG BY SLUG (PUBLIC) ================= */
// ⚠️ MUST BE LAST
// GET /api/blogs/:slug
router.get("/:slug", getBlogBySlug);

export default router;
