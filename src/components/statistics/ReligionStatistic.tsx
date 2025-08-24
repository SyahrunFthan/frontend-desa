import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MessageInstance } from "antd/es/message/interface";
import type { ReligionData } from "../../models/main/statistic";
import CustomTooltipReligion from "./CustomTooltipReligion";
import { getStatisticReligion } from "../../apis";
import { processFail } from "../../helpers/process";
import type { AxiosError } from "axios";
import { Typography } from "antd";

interface Props {
  messageApi: MessageInstance;
}

const ReligionStatistic: React.FC<Props> = ({ messageApi }) => {
  const [data, setData] = useState<ReligionData[]>([]);

  const fetchData = async () => {
    try {
      const response = await getStatisticReligion();
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

  return (
    <>
      <Typography.Title level={4}>Statistik Berdasarkan Agama</Typography.Title>
      <Typography.Paragraph>
        Distribusi penduduk berdasarkan agama
      </Typography.Paragraph>

      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
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
            <Tooltip content={<CustomTooltipReligion />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                fill: "#1d4ed8",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((religion, index) => {
          const colors = [
            "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200",
            "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200",
            "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200",
            "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200",
            "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200",
            "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200",
          ];

          return (
            <div
              key={religion.value}
              className={`rounded-lg p-4 border ${colors[index]}`}
            >
              <div className="flex flex-col">
                <p className="text-sm font-medium mb-1">{religion.name}</p>
                <p className="text-lg font-bold">
                  {religion.count.toLocaleString()}
                </p>
                <p className="text-xs opacity-75">{religion.percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data
                .reduce((sum, religion) => sum + religion.count, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Penduduk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...data.map((r) => r.percentage))}%
            </p>
            <p className="text-sm text-gray-600">Mayoritas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">6</p>
            <p className="text-sm text-gray-600">Agama Tercatat</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReligionStatistic;
