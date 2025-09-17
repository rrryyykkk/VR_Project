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
    timeStamp: string;
    rotX: number;
    rotY: number;
  }[];
}

export const RotationGraph = ({ data }: RotationGraphProps) => {
  const formatted = data.map((item) => ({
    time: new Date(item.timeStamp).toLocaleTimeString(),
    x: Number(item.rotX.toFixed(2)),
    y: Number(item.rotY.toFixed(2)),
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
          formatter={(value) =>
            typeof value === "number" ? `${value}°` : value
          }
        />
        <Legend />
        <Line type="monotone" dataKey="x" stroke="#8884d8" name="Rotasi X" />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" name="Rotasi Y" />
      </LineChart>
    </ResponsiveContainer>
  );
};
