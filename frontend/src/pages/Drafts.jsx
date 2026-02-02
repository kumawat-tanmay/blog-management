import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  CheckCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

const Drafts = () => {
  const { backendURL, token, user } = useContext(AuthContext);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH DRAFTS ================= */
  const fetchDrafts = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/blogs/drafts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDrafts(data.drafts || []);
    } catch (error) {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  /* ================= ACTIONS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this draft?")) return;

    try {
      await axios.delete(
        `${backendURL}/api/blogs/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Draft deleted");
      fetchDrafts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.patch(
        `${backendURL}/api/blogs/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Draft published");
      fetchDrafts();
    } catch {
      toast.error("Publish failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">

      {/* 🔙 BACK BUTTON — ALWAYS VISIBLE */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* HEADER */}
      <h1 className="text-3xl font-black text-slate-900">
        {user?.role === "superAdmin" ? "All Drafts" : "My Drafts"}
      </h1>

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-500">Loading drafts...</p>
      ) : drafts.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-black text-slate-700">
            No drafts foundwdwd
          </h2>
          <p className="text-slate-500 mt-2">
            Start writing and save blogs as drafts.
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="p-4 text-left">Title</th>
                {user?.role === "superAdmin" && (
                  <th className="p-4 text-left">Author</th>
                )}
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {drafts.map((blog) => (
                <tr key={blog._id} className="border-t">
                  <td className="p-4 font-semibold text-slate-800">
                    {blog.title}
                  </td>

                  {user?.role === "superAdmin" && (
                    <td className="p-4 text-slate-600">
                      {blog.author?.name || "—"}
                    </td>
                  )}

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600">
                      Draft
                    </span>
                  </td>

                  <td className="p-4 flex items-center gap-3">
                    {/* EDIT */}
                    <button
                      onClick={() =>
                        navigate(`/blogs/edit/id/${blog._id}`)
                      }
                      className="text-slate-500 hover:text-indigo-600"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>

                    {/* PUBLISH */}
                    {(user?.role === "editor" ||
                      user?.role === "superAdmin") && (
                      <button
                        onClick={() => handlePublish(blog._id)}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="Publish"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-rose-500 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Drafts;
