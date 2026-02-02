import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    /* 🔍 SEO Fields */
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,

    ogTitle: String,
    ogDescription: String,
    ogImage: String,

    twitterCard: String,

    /* 🧩 Blog Structure */
    tags: [String],
    categories: [String],

    faq: [
      {
        question: String,
        answer: String,
      },
    ],

    internalLinks: [String],
    externalLinks: [String],

    featureImage: String,

   
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
