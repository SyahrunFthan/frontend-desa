import { COLORS } from "../../assets";

interface Props {
  label: string;
  value: number;
  total: number;
  color: string;
}

const ProgressBar = ({ label, value, total, color }: Props) => {
  const percentage = (value / total) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-sm font-medium"
          style={{ color: COLORS.secondary }}
        >
          {label}
        </span>
        <span className="text-sm font-bold" style={{ color: COLORS.darkGray }}>
          {value.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-3"
        style={{ backgroundColor: COLORS.gray }}
      >
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
