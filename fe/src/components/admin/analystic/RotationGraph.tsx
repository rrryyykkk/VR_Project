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
  Brush,
} from "recharts";
import dayjs from "dayjs";
import { useMemo } from "react";

interface RotationGraphProps {
  data: {
    timeStamp: string;
    rotX: number;
    rotY: number;
  }[];
}

export const RotationGraph = ({ data }: RotationGraphProps) => {
  // 🚀 selalu panggil hook di atas
  const formatted = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Hitung durasi data (menit)
    const first = new Date(data[0].timeStamp).getTime();
    const last = new Date(data[data.length - 1].timeStamp).getTime();
    const durationMinutes = (last - first) / 1000 / 60;

    // Tentukan format waktu adaptif
    let timeFormat = "HH:mm:ss";
    if (durationMinutes >= 5 && durationMinutes < 60) {
      timeFormat = "HH:mm";
    } else if (durationMinutes >= 60) {
      timeFormat = "DD/MM HH:mm";
    }

    return data.map((item) => ({
      time: dayjs(item.timeStamp).format(timeFormat),
      fullTime: dayjs(item.timeStamp).format("YYYY-MM-DD HH:mm:ss"),
      x: Number(item.rotX.toFixed(2)),
      y: Number(item.rotY.toFixed(2)),
    }));
  }, [data]);

  if (!formatted.length) {
    return <p className="text-gray-500">Tidak ada data rotasi</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={formatted}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label, payload) =>
            payload && payload.length > 0 ? payload[0].payload.fullTime : label
          }
          formatter={(value) =>
            typeof value === "number" ? `${value}°` : value
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="x"
          stroke="#8884d8"
          name="Rotasi X"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#82ca9d"
          name="Rotasi Y"
          dot={false}
          isAnimationActive={false}
        />
        <Brush
          dataKey="time"
          height={25}
          stroke="#8884d8"
          travellerWidth={10}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
