import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  FileText,
  CheckSquare,
  BookOpen,
  PenTool,
  Zap,
  Hash,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const statsConfig = {
    superAdmin: [
      { label: "Total Users", icon: <Users />, color: "bg-blue-600" },
      { label: "Total Blogs", icon: <FileText />, color: "bg-indigo-600" },
      { label: "Pending Approvals", icon: <CheckSquare />, color: "bg-amber-500" },
    ],
    editor: [
      { label: "Blogs to Review", icon: <CheckSquare />, color: "bg-orange-500" },
      { label: "Published Blogs", icon: <BookOpen />, color: "bg-emerald-600" },
    ],
    author: [
      { label: "My Drafts", icon: <PenTool />, color: "bg-violet-600" },
      { label: "Published Blogs", icon: <BookOpen />, color: "bg-blue-600" },
    ],
    viewer: [
      { label: "Latest Blogs", icon: <Zap />, color: "bg-rose-500" },
      { label: "Categories", icon: <Hash />, color: "bg-slate-700" },
    ],
  };

  const stats = statsConfig[user?.role] || [];

  return (
    <>
      <h1 className="text-3xl font-black mb-2">Overview</h1>
      <p className="text-slate-500 mb-8">
        Monitoring your blog performance as{" "}
        <span className="text-indigo-600 font-bold">{user?.role}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className={`p-3 rounded-2xl text-white w-fit ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-bold mt-4 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
