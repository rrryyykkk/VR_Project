// src/pages/admin/Dashboard.tsx
import { motion } from "framer-motion";
import { FiUsers, FiClock, FiEye, FiActivity } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetDashboard } from "../../app/store/AdminStore";

// Tipe data dashboard
export interface DashboardData {
  activeUsers: number;
  averageSessions: number; // dalam detik
  totalXRViews: number;
  totalInteractions: number;
  chartData: { name: string; views: number; interactions: number }[];
}

// Helper format durasi
const formatDuration = (seconds: number) => {
  if (!seconds || seconds < 0) return "-";
  if (seconds < 60) return `${seconds} detik`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboard();

  if (isLoading)
    return <p className="p-6 text-gray-400">⏳ Loading dashboard...</p>;
  if (isError || !data)
    return <p className="p-6 text-red-500">❌ Gagal memuat data dashboard</p>;

  // Cards info
  const cards = [
    {
      title: "Active Users",
      value: data.activeUsers.toString(),
      icon: <FiUsers className="text-blue-500 text-3xl" />,
    },
    {
      title: "Average Session",
      value: formatDuration(data.averageSessions),
      icon: <FiClock className="text-green-500 text-3xl" />,
    },
    {
      title: "XR Views",
      value: data.totalXRViews.toString(),
      icon: <FiEye className="text-purple-500 text-3xl" />,
    },
    {
      title: "Interactions",
      value: data.totalInteractions.toString(),
      icon: <FiActivity className="text-yellow-500 text-3xl" />,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 text-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              {card.icon}
              <div>
                <h3 className="text-sm text-gray-400">{card.title}</h3>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-gray-100 text-lg font-semibold mb-4">
          Weekly XR Views & Interactions
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              labelStyle={{ color: "#F9FAFB" }}
              itemStyle={{ color: "#F9FAFB" }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8B5CF6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="interactions"
              stroke="#10B981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
