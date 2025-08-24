import type { ReligionData } from "../../models/main/statistic";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ReligionData;
    value: number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltipReligion: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
        <p className="text-sm text-gray-600">
          Jumlah:{" "}
          <span className="font-medium text-blue-600">
            {data.count.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Persentase:{" "}
          <span className="font-medium text-blue-600">{data.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltipReligion;
