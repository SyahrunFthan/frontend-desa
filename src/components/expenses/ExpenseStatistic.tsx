import { Card, Typography } from "antd";
import type { TFunction } from "i18next";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import type { Statistic } from "../../models/expense";

interface Props {
  t: TFunction;
  statistics: Statistic[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{`Tahun ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            Pendapatan: Rp {entry.value.toLocaleString()} juta
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ExpenseStatistic = ({ t, statistics }: Props) => {
  return (
    <Card>
      <Typography.Title level={3}>{t("incomes.statistic")}</Typography.Title>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={statistics}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#F24B29
"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#F24B29
"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total_expense"
            stroke="#F24B29
"
            fillOpacity={1}
            fill="url(#colorProfit)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExpenseStatistic;
