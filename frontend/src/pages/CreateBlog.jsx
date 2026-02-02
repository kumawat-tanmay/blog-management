import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Type,
  Link2,
  FileText,
  Search,
  Globe,
  Tag,
  Image as ImageIcon,
  Send,
  Loader2,
  Settings
} from "lucide-react";

const CreateBlog = () => {
  const { backendURL, token } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    ogTitle: "",
    ogDescription: "",
    canonicalUrl: "",
    tags: "",
    categories: "",
    status: "draft",
  });

  const [featureImage, setFeatureImage] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      return toast.error("Title & content are required");
    }

    try {
      setLoading(true);

      const data = new FormData();

      // 🔹 Safe slug generation
      const finalSlug =
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      data.append("title", form.title);
      data.append("slug", finalSlug);
      data.append("content", form.content);

      data.append("metaTitle", form.metaTitle);
      data.append("metaDescription", form.metaDescription);
      data.append("canonicalUrl", form.canonicalUrl);

      data.append("ogTitle", form.ogTitle);
      data.append("ogDescription", form.ogDescription);

      data.append(
        "tags",
        JSON.stringify(form.tags.split(",").map(t => t.trim()).filter(Boolean))
      );
      data.append(
        "categories",
        JSON.stringify(form.categories.split(",").map(c => c.trim()).filter(Boolean))
      );

      data.append("status", form.status);

      if (featureImage) data.append("featureImage", featureImage);
      if (ogImage) data.append("ogImage", ogImage);

      await axios.post(`${backendURL}/api/blogs`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog created successfully");

      setForm({
        title: "",
        slug: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        canonicalUrl: "",
        tags: "",
        categories: "",
        status: "draft",
      });
      setFeatureImage(null);
      setOgImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Blog creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-slate-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-300 pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Create New Post
          </h1>
          <p className="text-slate-600 font-bold">
            Draft your next masterpiece and optimize it for search engines.
          </p>
        </div>
        <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
          form.status === "published"
            ? "bg-emerald-500 text-white border-emerald-600"
            : "bg-slate-300 text-slate-700 border-slate-400"
        }`}>
          {form.status} Mode
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          {/* Main Content Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-300 shadow-[6px_6px_0px_0px_rgba(203,213,225,1)]">
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
              <FileText size={20} />
              <h2 className="font-black uppercase text-xs tracking-widest">
                General Information
              </h2>
            </div>

            <div className="space-y-5">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title..."
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-4 font-bold text-lg outline-none focus:border-indigo-500 transition-colors"
              />

              <div className="flex items-center bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-1 focus-within:border-indigo-500 transition-colors">
                <Link2 className="text-slate-400 mr-2" size={18} />
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="how-to-build-a-blog"
                  className="w-full bg-transparent py-3 font-medium outline-none"
                />
              </div>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={12}
                placeholder="Start writing your story..."
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-3xl p-5 font-medium outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* SEO Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-300 shadow-[6px_6px_0px_0px_rgba(203,213,225,1)]">
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <Search size={20} />
              <h2 className="font-black uppercase text-xs tracking-widest">
                SEO Optimization
              </h2>
            </div>

            <div className="space-y-4">
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="SEO Meta Title"
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 transition-colors"
              />

              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                rows={3}
                placeholder="SEO Meta Description"
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 font-medium outline-none focus:border-emerald-500 transition-colors"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="ogTitle"
                  value={form.ogTitle}
                  onChange={handleChange}
                  placeholder="OG Title"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 transition-colors"
                />

                <input
                  name="canonicalUrl"
                  value={form.canonicalUrl}
                  onChange={handleChange}
                  placeholder="Canonical URL"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <textarea
                name="ogDescription"
                value={form.ogDescription}
                onChange={handleChange}
                rows={2}
                placeholder="OG Description"
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 font-medium outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-8">

          {/* Publish Card */}
          <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-4 border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[10px] font-black tracking-widest">
              <Settings size={14} />
              Settings
            </div>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 font-black text-sm outline-none mb-4 cursor-pointer"
            >
              <option value="draft">📁 Save as Draft</option>
              <option value="published">🚀 Publish Now</option>
            </select>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {loading ? "Processing..." : "Create Post"}
            </button>
          </div>

          {/* Media Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-[6px_6px_0px_0px_rgba(203,213,225,1)] space-y-6">
            
            {/* Feature Image */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <ImageIcon size={12}/> Main Feature Image
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 text-center hover:border-indigo-500 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFeatureImage(e.target.files[0])} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-500">
                  {featureImage ? featureImage.name : "Click to upload Feature Image"}
                </span>
              </div>
            </div>

            {/* OG Image */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <Globe size={12}/> Social (OG) Image
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 text-center hover:border-emerald-500 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setOgImage(e.target.files[0])} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-500">
                  {ogImage ? ogImage.name : "Click to upload OG Image"}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="space-y-4">
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-4 text-slate-400" />
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Tags: tech, ai, future"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 pl-10 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="relative">
                <Globe size={14} className="absolute left-3 top-4 text-slate-400" />
                <input
                  name="categories"
                  value={form.categories}
                  onChange={handleChange}
                  placeholder="Categories: Technology, AI"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-3 pl-10 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;