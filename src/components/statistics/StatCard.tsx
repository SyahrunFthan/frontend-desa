import { Card } from "antd";
import { COLORS } from "../../assets";

interface Props {
  total: number;
  icon: string;
  title: string;
  description: string;
  bgColor?: string;
  textColor?: string;
}

const StatCard = ({
  total,
  icon,
  title,
  description,
  bgColor = COLORS.primary,
  textColor = COLORS.secondary,
}: Props) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <div className="text-3xl font-bold" style={{ color: textColor }}>
          {total}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: textColor }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: COLORS.darkGray }}>
        {description}
      </p>
    </Card>
  );
};

export default StatCard;
