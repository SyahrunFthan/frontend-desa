import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { MessageInstance } from "antd/es/message/interface";
import { getStatisticAgeGroup } from "../../apis";
import { processFail } from "../../helpers/process";
import type { AxiosError } from "axios";
import type { AgeGroupData } from "../../models/main/statistic";
import CustomTooltipAge from "./CustomTooltipAge";
import { Typography } from "antd";

interface Props {
  messageApi: MessageInstance;
}

const colors = [
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

const AgeGroupStatistic: React.FC<Props> = ({ messageApi }) => {
  const [data, setData] = useState<AgeGroupData[]>([]);
  const fetchData = async () => {
    try {
      const response = await getStatisticAgeGroup();
      setData(response.data.result);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchData",
        axiosError.response?.data?.message || "Server Error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryStats = data.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { count: 0, percentage: 0 };
    }
    acc[curr.category].count += curr.count;
    acc[curr.category].percentage += curr.percentage;
    return acc;
  }, {} as Record<string, { count: number; percentage: number }>);

  return (
    <>
      <Typography.Title level={4}>Statistik Berdasarkan Agama</Typography.Title>
      <Typography.Paragraph>
        Distribusi penduduk berdasarkan agama
      </Typography.Paragraph>

      {/* Bar Chart */}
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="ageRange"
              stroke="#666"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              label={{
                value: "Jumlah Penduduk",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltipAge />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} cursor="pointer">
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.map((group, index) => (
          <div
            key={group.ageRange}
            className="rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <p className="text-sm font-medium text-gray-800">
                {group.ageRange} tahun
              </p>
            </div>
            <p className="text-xs text-gray-600 mb-2">{group.category}</p>
            <p className="text-lg font-bold text-gray-900">
              {group.count.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">{group.percentage}%</p>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>
                <span className="text-blue-500">♂</span> {group.male}
              </span>
              <span>
                <span className="text-pink-500">♀</span> {group.female}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(categoryStats).map(([category, stats], index) => {
          const categoryColors = [
            "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800",
            "bg-gradient-to-r from-green-50 to-green-100 text-green-800",
            "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800",
            "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800",
          ];

          return (
            <div
              key={category}
              className={`rounded-lg p-4 ${
                categoryColors[index % categoryColors.length]
              }`}
            >
              <p className="text-sm font-medium mb-1">{category}</p>
              <p className="text-lg font-bold">
                {stats.count.toLocaleString()}
              </p>
              <p className="text-xs opacity-75">
                {stats.percentage.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Overall Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data
                .reduce((sum, group) => sum + group.count, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Penduduk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {
                data.find(
                  (g) => g.count === Math.max(...data.map((g) => g.count))
                )?.ageRange
              }
            </p>
            <p className="text-sm text-gray-600">Kelompok Terbesar</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {(
                (data.reduce((sum, group) => sum + group.male, 0) /
                  data.reduce((sum, group) => sum + group.count, 0)) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600">Rasio Laki-laki</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-600">
              {(
                (data.reduce((sum, group) => sum + group.female, 0) /
                  data.reduce((sum, group) => sum + group.count, 0)) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600">Rasio Perempuan</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgeGroupStatistic;
