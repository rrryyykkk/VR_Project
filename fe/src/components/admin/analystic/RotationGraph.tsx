import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="x" stroke="#8884d8" name="Rotasi X" />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" name="Rotasi Y" />
        <Line type="monotone" dataKey="z" stroke="#ffc658" name="Rotasi Z" />
      </LineChart>
    </ResponsiveContainer>
  );
};
