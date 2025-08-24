import type { AgeGroupData } from "../../models/main/statistic";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: AgeGroupData;
    value: number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltipAge: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">
          Umur {data.ageRange} ({data.category})
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Total:{" "}
          <span className="font-medium text-blue-600">
            {data.count.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Persentase:{" "}
          <span className="font-medium text-blue-600">{data.percentage}%</span>
        </p>
        <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs">
            <span className="text-blue-500">♂</span> Laki-laki: {data.male}
          </div>
          <div className="text-xs">
            <span className="text-pink-500">♀</span> Perempuan: {data.female}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltipAge;
