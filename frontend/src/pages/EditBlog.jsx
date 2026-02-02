import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Image as ImageIcon,
  Send,
  Loader2,
  Settings
} from "lucide-react";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendURL, token } = useContext(AuthContext);

  const [form, setForm] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH BLOG ---------------- */
  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/blogs/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        title: data.blog.title,
        slug: data.blog.slug,
        content: data.blog.content,
        metaTitle: data.blog.metaTitle || "",
        metaDescription: data.blog.metaDescription || "",
        ogTitle: data.blog.ogTitle || "",
        ogDescription: data.blog.ogDescription || "",
        canonicalUrl: data.blog.canonicalUrl || "",
        tags: (data.blog.tags || []).join(", "),
        categories: (data.blog.categories || []).join(", "),
        status: data.blog.status || "draft",
      });
    } catch {
      toast.error("Failed to load blog");
      navigate("/blogs");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- UPDATE BLOG ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("slug", form.slug);
      data.append("content", form.content);
      data.append("metaTitle", form.metaTitle);
      data.append("metaDescription", form.metaDescription);
      data.append("canonicalUrl", form.canonicalUrl);
      data.append("ogTitle", form.ogTitle);
      data.append("ogDescription", form.ogDescription);
      data.append("status", form.status);

      data.append(
        "tags",
        JSON.stringify(form.tags.split(",").map(t => t.trim()))
      );
      data.append(
        "categories",
        JSON.stringify(form.categories.split(",").map(c => c.trim()))
      );

      if (featureImage) data.append("featureImage", featureImage);
      if (ogImage) data.append("ogImage", ogImage);

      await axios.put(`${backendURL}/api/blogs/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog updated successfully");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return <p className="text-slate-500">Loading blog...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-black text-slate-900">Edit Blog</h1>
        <p className="text-slate-500">Update content and SEO details</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white p-6 rounded-3xl border">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FileText size={20} />
              <h2 className="font-bold text-xs uppercase tracking-widest">
                General Info
              </h2>
            </div>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 mb-3"
            />

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 mb-3"
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full bg-slate-50 border rounded-xl p-3"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Search size={20} />
              <h2 className="font-bold text-xs uppercase tracking-widest">
                SEO
              </h2>
            </div>

            <input
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 mb-3"
            />

            <textarea
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 border rounded-xl p-3 mb-3"
            />

            <input
              name="ogTitle"
              value={form.ogTitle}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 mb-3"
            />

            <textarea
              name="ogDescription"
              value={form.ogDescription}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-50 border rounded-xl p-3"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-slate-900 text-white p-6 rounded-3xl">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-800 rounded-xl p-3 font-bold"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <button
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 py-4 rounded-2xl font-black flex justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border space-y-4">
            <label className="text-xs font-bold">Replace Feature Image</label>
            <input type="file" onChange={e => setFeatureImage(e.target.files[0])} />

            <label className="text-xs font-bold">Replace OG Image</label>
            <input type="file" onChange={e => setOgImage(e.target.files[0])} />

            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 text-xs"
            />

            <input
              name="categories"
              value={form.categories}
              onChange={handleChange}
              className="w-full bg-slate-50 border rounded-xl p-3 text-xs"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
