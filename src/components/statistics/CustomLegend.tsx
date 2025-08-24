import type { GenderData } from "../../models/main/statistic";

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
  data: GenderData[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload, data }) => {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 font-medium">{entry.value}</span>
          <span className="text-gray-500 text-sm">
            ({data.find((item: GenderData) => item.name === entry.value)?.count}
            )
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
