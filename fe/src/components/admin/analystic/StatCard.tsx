interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="stats shadow bg-base-100">
      <div className="stat">
        <div className="stat-title">{label}</div>
        <div className="stat-value text-primary">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
