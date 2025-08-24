import type { TooltipProps } from "recharts";
import type { GenderData } from "../../models/main/statistic";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: GenderData;
    value: number;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.payload.name}</p>
        <p className="text-sm text-gray-600">
          Jumlah: <span className="font-medium">{data.payload.count}</span>
        </p>
        <p className="text-sm text-gray-600">
          Persentase: <span className="font-medium">{data.value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
