import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Users, FileText, PenTool } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Overview = () => {
  const { user, token, backendURL } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${backendURL}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(data.stats || {});
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  // 👀 Viewer ko kuch bhi nahi
  if (user.role === "viewer") {
    return (
      <p className="text-slate-500">
        You don’t have access to dashboard analytics.
      </p>
    );
  }

  /* ---------------- ROLE BADGE COLOR ---------------- */
  const roleColor = {
    superAdmin: "bg-purple-100 text-purple-700",
    editor: "bg-emerald-100 text-emerald-700",
    author: "bg-blue-100 text-blue-700",
    viewer: "bg-slate-200 text-slate-700",
  };

  /* ---------------- GRAPH DATA ---------------- */
  const graphData =
    user.role === "superAdmin"
      ? [
          { name: "Total Published", value: stats.totalBlogs || 0 },
          { name: "Total Drafts", value: stats.totalDrafts || 0 },
          { name: "My Published", value: stats.myBlogs || 0 },
          { name: "My Drafts", value: stats.myDrafts || 0 },
        ]
      : [
          { name: "My Published", value: stats.myBlogs || 0 },
          { name: "My Drafts", value: stats.myDrafts || 0 },
        ];

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black">Overview</h1>

        {/* 👤 USER + ROLE */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">
            {user.name}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${roleColor[user.role]}`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SUPER ADMIN */}
        {user.role === "superAdmin" && (
          <>
            <StatCard label="Total Users" value={stats.totalUsers} icon={<Users />} />
            <StatCard label="Total Blogs" value={stats.totalBlogs} icon={<FileText />} />
            <StatCard label="Total Drafts" value={stats.totalDrafts} icon={<PenTool />} />
            <StatCard label="My Blogs" value={stats.myBlogs} icon={<FileText />} />
            <StatCard label="My Drafts" value={stats.myDrafts} icon={<PenTool />} />
          </>
        )}

        {/* EDITOR */}
        {user.role === "editor" && (
          <>
            <StatCard label="Total Blogs" value={stats.totalBlogs} icon={<FileText />} />
            <StatCard label="My Blogs" value={stats.myBlogs} icon={<FileText />} />
            <StatCard label="My Drafts" value={stats.myDrafts} icon={<PenTool />} />
          </>
        )}

        {/* AUTHOR */}
        {user.role === "author" && (
          <>
            <StatCard label="Total Blogs" value={stats.totalBlogs} icon={<FileText />} />
            <StatCard label="My Blogs" value={stats.myBlogs} icon={<FileText />} />
            <StatCard label="My Drafts" value={stats.myDrafts} icon={<PenTool />} />
          </>
        )}
      </div>

      {/* ================= GRAPH ================= */}
      <div className="mt-10 bg-white border rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-black mb-4">
          Blog Activity Overview
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border shadow-sm">
    <div className="p-3 rounded-2xl bg-indigo-600 text-white w-fit">
      {icon}
    </div>
    <p className="text-slate-500 text-sm font-bold mt-4 uppercase">
      {label}
    </p>
    <h3 className="text-4xl font-black mt-1">
      {value ?? 0}
    </h3>
  </div>
);

export default Overview;
