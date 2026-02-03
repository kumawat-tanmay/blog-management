import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function BlogView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { backendURL } = useContext(AuthContext);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/blogs/${slug}`);
      setBlog(res.data.blog);
    } catch (err) {
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!blog) return <div className="text-center mt-20 font-black text-slate-400">BLOG NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription} />
      </Helmet>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button 
          onClick={() => navigate("/blogs")}
          className="group flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Grid: Image Left, Title Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          
          {/* Choti Image with Scale Effect */}
          <div className="overflow-hidden rounded-3xl border-2 border-slate-200 shadow-lg group">
            {blog.featureImage ? (
              <img
                src={blog.featureImage}
                alt={blog.title}
                className="w-full h-87.5 object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-87.5 bg-slate-50 flex items-center justify-center">No Image</div>
            )}
          </div>

          {/* Title & Simple Author Info */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-slate-900">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                {blog.author?.name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-lg leading-none">{blog.author?.name}</h4>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> {new Date(blog.publishedAt).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content */}
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-slate prose-lg max-w-none
            prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-img:rounded-2xl prose-img:border-2"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Clean Tag Section */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
            {blog.tags && JSON.parse(blog.tags[0] || "[]").map((tag, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}