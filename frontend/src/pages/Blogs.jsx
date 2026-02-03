import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Edit, Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const { backendURL, token, user } = useContext(AuthContext);

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);
  const observerInstance = useRef(null);
  const navigate = useNavigate();

  /* ================= RESET ON MOUNT ================= */
  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
  }, []);

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendURL}/api/blogs?page=${page}&limit=10`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setBlogs((prev) => {
        const existingIds = new Set(prev.map((b) => b._id));
        const newBlogs = (data.blogs || []).filter(
          (b) => !existingIds.has(b._id)
        );
        return [...prev, ...newBlogs];
      });

      if (
        data.pagination.currentPage >=
        data.pagination.totalPages
      ) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE BLOG ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;

    try {
      await axios.delete(
        `${backendURL}/api/blogs/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= OBSERVER ================= */
  useEffect(() => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchBlogs();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observerInstance.current.observe(observerRef.current);
    }

    return () => observerInstance.current?.disconnect();
  }, [hasMore]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">
        Blogs
      </h1>

      {/* BLOG LIST */}
      <div className="bg-white border rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Author</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t">
                <td className="p-4 font-semibold">
                  {blog.title}
                </td>

                <td className="p-4">
                  {blog.author?.name}
                </td>

                <td className="p-4 flex gap-3">
                  <Eye
                    size={18}
                    className="cursor-pointer text-slate-500"
                    onClick={() =>
                      navigate(`/blog/${blog.slug}`)
                    }
                  />

                  {(user?.role === "editor" ||
                    user?.role === "superAdmin" ||
                    blog.author?._id === user?._id) && (
                    <Edit
                      size={18}
                      className="cursor-pointer text-emerald-600"
                      onClick={() =>
                        navigate(`/blogs/edit/id/${blog._id}`)
                      }
                    />
                  )}

                  {user?.role === "superAdmin" && (
                    <Trash2
                      size={18}
                      className="cursor-pointer text-rose-500"
                      onClick={() =>
                        handleDelete(blog._id)
                      }
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div ref={observerRef} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" />
            Loading more blogs...
          </div>
        )}

        {!hasMore && (
          <p className="text-slate-400 text-sm">
            You’ve reached the end 🚀
          </p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
