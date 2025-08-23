import { Card, Col, Empty, Row, Typography } from "antd";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { getStatisticJob } from "../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../helpers/process";
import ProgressBar from "./ProgressBar";
import type { JobStat } from "../../models/main/statistic";

interface Props {
  messageApi: MessageInstance;
}

const JobStatistic = ({ messageApi }: Props) => {
  const [total, setTotal] = useState({
    totalWork: 0,
    totalNotWork: 0,
    totalResident: 0,
  });
  const [jobs, setJobs] = useState<JobStat[]>([]);

  const fetchData = async () => {
    try {
      const response = await getStatisticJob();
      const { jobStatsArr, totalResident, totalNotWork, totalWork } =
        response.data;

      setTotal({
        totalNotWork,
        totalResident,
        totalWork,
      });
      setJobs(jobStatsArr);
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
      <Typography.Title level={4}>Daftar Pekerjaan Penduduk</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={8} lg={8} xl={8} xxl={8}>
          <StatCard
            description="Jumlah Penduduk"
            icon="👥"
            title="Total Penduduk"
            total={total.totalResident}
          />
        </Col>
        <Col sm={24} xs={24} md={8} lg={8} xl={8} xxl={8}>
          <StatCard
            description={`${
              total.totalResident > 0
                ? ((total.totalWork / total.totalResident) * 100).toFixed(1)
                : 0
            }% Dari total penduduk`}
            title="Total Penduduk Bekerja"
            total={total.totalWork}
            icon="💼"
            bgColor="#d4d4de"
          />
        </Col>
        <Col sm={24} xs={24} md={8} lg={8} xl={8} xxl={8}>
          <StatCard
            description={`${
              total.totalResident > 0
                ? ((total.totalNotWork / total.totalResident) * 100).toFixed(1)
                : 0
            }% Dari total penduduk`}
            title="Total Penduduk Belum Bekerja"
            total={total.totalWork}
            icon="🛋️"
            bgColor="#d19301"
          />
        </Col>
        <Col span={24}>
          <Card>
            {jobs.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {jobs.map((item, index) => {
                  return (
                    <ProgressBar
                      key={index}
                      label={item?.job}
                      value={item?.total}
                      total={total.totalResident}
                      color="#10b981"
                    />
                  );
                })}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JobStatistic;
