// src/components/admin/analystic/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="stats shadow bg-base-100 rounded-lg">
      <div className="stat p-4">
        <div className="stat-title text-gray-600">{label}</div>
        <div className="stat-value text-primary text-2xl">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
