import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import ProtectedLayout from "./components/ProtectedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Blogs from "./pages/Blogs";
import Users from "./pages/Users";
import CreateBlog from "./pages/CreateBlog";
import Overview from "./pages/Overview";
import DashboardLayout from "./components/DashboardLayout";
import EditBlog from "./pages/EditBlog";
import BlogView from "./pages/BlogView";
import Drafts from "./pages/Drafts";
import MyBlogs from "./pages/MyBlogs";

const App = () => {
  return (
    <div className="h-screen w-full bg-slate-950">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />
        <Route path="/blog/:slug" element={<BlogView />} />

        {/* Protected */}
        <Route element={<ProtectedLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/my" element={<MyBlogs />} />

            <Route path="/blogs/drafts" element={<Drafts />} />
            <Route path="/blogs/edit/id/:id" element={<EditBlog />} />

          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </div>
  );
};

export default App;
