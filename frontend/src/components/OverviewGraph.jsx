import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const OverviewGraph = ({ stats, role }) => {
  
  if (role === "viewer") return null;

  const data =
    role === "superAdmin"
      ? [
          { name: "Published Blogs", value: stats.totalBlogs || 0 },
          { name: "Draft Blogs", value: stats.myDrafts || 0 },
        ]
      : [
          { name: "My Published", value: stats.myBlogs || 0 },
          { name: "My Drafts", value: stats.myDrafts || 0 },
        ];

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-black mb-4">
        Blog Activity Overview
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewGraph;
