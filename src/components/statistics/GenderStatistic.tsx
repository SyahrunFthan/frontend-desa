import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { GenderData } from "../../models/main/statistic";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import { Empty, Typography } from "antd";
import type { AxiosError } from "axios";
import type { MessageInstance } from "antd/es/message/interface";
import { processFail } from "../../helpers/process";
import { getStatisticGender } from "../../apis";

interface Props {
  messageApi: MessageInstance;
}

const COLORS: string[] = ["#6366f1", "#ec4899"];

const GenderStatistic = ({ messageApi }: Props) => {
  const [data, setData] = useState<GenderData[]>([]);

  const fetchData = async () => {
    try {
      const response = await getStatisticGender();
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
      <Typography.Title level={4}>
        Statistik Berdasarkan Jenis Kelamin
      </Typography.Title>
      <Typography.Paragraph>
        Distribusi penduduk berdasarkan jenis kelamin
      </Typography.Paragraph>
      {data.length > 0 ? (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((_: GenderData, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend data={data} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium">
                    Laki-laki
                  </p>
                  <p className="text-lg font-bold text-indigo-900">
                    {data[0]?.count}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-pink-600 font-medium">Perempuan</p>
                  <p className="text-lg font-bold text-pink-900">
                    {data[1]?.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default GenderStatistic;
