import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  PenTool,
  Search,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  /* ================= ROLE BASED MENU ================= */
  const menuConfig = {
    superAdmin: [
      { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Drafts", path: "/blogs/drafts", icon: <FileText size={20} /> },
      { name: "My Blogs", path: "/blogs/my", icon: <FileText size={20} /> }, // ✅ ADD
      { name: "All Blogs", path: "/blogs", icon: <FileText size={20} /> },
      { name: "Create Blog", path: "/blogs/create", icon: <PenTool size={20} /> },
      { name: "Manage Users", path: "/users", icon: <Users size={20} /> },
    ],


    editor: [
      { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Drafts", path: "/blogs/drafts", icon: <FileText size={20} /> },
      { name: "My Blogs", path: "/blogs/my", icon: <FileText size={20} /> }, // ✅ ADD
      { name: "All Blogs", path: "/blogs", icon: <FileText size={20} /> },
      { name: "Create Blog", path: "/blogs/create", icon: <PenTool size={20} /> },
    ],


    author: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Drafts", path: "/blogs/drafts", icon: <FileText size={20} /> },
      { name: "My Blogs", path: "/blogs/my", icon: <FileText size={20} /> }, // ✅ ADD
      { name: "All Blogs", path: "/blogs", icon: <FileText size={20} /> },
      { name: "Create Blog", path: "/blogs/create", icon: <PenTool size={20} /> },
    ],

    viewer: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Browse Blogs", path: "/blogs", icon: <Search size={20} /> },
    ],
  };

  const currentMenu = menuConfig[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-slate-900 transition-all flex flex-col`}>
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
          <LayoutDashboard className="text-white" />
          {isSidebarOpen && <span className="text-white font-black">Workspace</span>}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {currentMenu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              {isSidebarOpen && item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="p-4 text-rose-400 hover:bg-rose-400/10 flex items-center gap-3"
        >
          <LogOut size={18} />
          {isSidebarOpen && "Logout"}
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="flex items-center gap-3">
            <Bell className="text-slate-400" />
            <span className="font-bold">{user.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
