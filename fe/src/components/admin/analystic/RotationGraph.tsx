// src/components/admin/analystic/RotationGraph.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RotationGraphProps {
  data: {
    timestamp: string;
    rotation: { x: number; y: number; z: number };
  }[];
}

export const RotationGraph = ({ data }: RotationGraphProps) => {
  const formatted = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    x: item.rotation.x,
    y: item.rotation.y,
    z: item.rotation.z,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formatted}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip
          formatter={(value) => {
            if (Array.isArray(value)) {
              return value
                .map((v) => (typeof v === "number" ? `${v}°` : v))
                .join(", ");
            }
            return value != null ? `${value}°` : "";
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="x" stroke="#8884d8" name="Rotasi X" />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" name="Rotasi Y" />
        <Line type="monotone" dataKey="z" stroke="#ffc658" name="Rotasi Z" />
      </LineChart>
    </ResponsiveContainer>
  );
};
