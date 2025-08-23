import { Button, Col, Flex, Input, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { COLORS } from "../../assets";
import { getStatisticResident } from "../../apis";
import { processFail } from "../../helpers/process";
import { statisticResidentColumns } from "../../constants/statisticResidentColumns";
import type { AxiosError } from "axios";
import type { MessageInstance } from "antd/es/message/interface";
import type { ResidentStatisticTableParams } from "../../models/main/statistic";
import StatCard from "./StatCard";

interface Props {
  messageApi: MessageInstance;
}

const ResidentStatistic = ({ messageApi }: Props) => {
  const [tableParams, setTableParams] = useState<ResidentStatisticTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 10,
      current: 1,
    },
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState({
    male: 0,
    female: 0,
    totalResident: 0,
    totalLeader: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getStatisticResident({
        current: tableParams.pagination?.current ?? 1,
        pageSize: tableParams.pagination?.pageSize ?? 10,
        search: tableParams.search ?? "",
      });
      const { total, totalResident, totalLeader, male, female, residents } =
        response.data;
      setDataSource(residents);
      setTotal({
        male: male,
        female: female,
        totalResident: totalResident,
        totalLeader: totalLeader,
      });
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchData",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const columns = statisticResidentColumns({ tableParams });

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <>
      <Typography.Title level={4}>Data Statistik Penduduk</Typography.Title>

      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={6} lg={6} xl={6} xxl={6}>
          <StatCard
            description="Jumlah Penduduk"
            icon="👥"
            title="Total Penduduk"
            total={total.totalResident}
          />
        </Col>
        <Col sm={24} xs={24} md={6} lg={6} xl={6} xxl={6}>
          <StatCard
            description="Jumlah Penduduk Laki-Laki"
            icon="👨"
            title="Total Laki-Laki"
            total={total.male}
            bgColor={COLORS.secondary}
            textColor={COLORS.secondary}
          />
        </Col>
        <Col sm={24} xs={24} md={6} lg={6} xl={6} xxl={6}>
          <StatCard
            description="Jumlah Penduduk Perempuan"
            icon="👩"
            title="Total Perempuan"
            total={total.female}
            bgColor={"#ff6b9d"}
            textColor={COLORS.secondary}
          />
        </Col>
        <Col sm={24} xs={24} md={6} lg={6} xl={6} xxl={6}>
          <StatCard
            description="Jumlah Kepala Keluarga"
            icon="🧾"
            title="Total Kepala Keluarga"
            total={total.totalLeader}
            bgColor={"#e10201"}
            textColor={COLORS.secondary}
          />
        </Col>
        <Col span={24}>
          <Flex gap={"small"} className="w-full lg:w-[20%]">
            <Input
              placeholder="Cari Nama"
              value={tableParams.search}
              onChange={(e) =>
                setTableParams((prev) => ({ ...prev, search: e.target.value }))
              }
              onPressEnter={() => fetchData()}
            />

            <Button onClick={() => fetchData()}>
              <SearchOutlined />
            </Button>
          </Flex>

          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={tableParams.pagination}
            bordered
            rowKey={"id"}
            className="mt-5"
            onChange={(pagination) => {
              setTableParams((prev) => ({
                ...prev,
                pagination: {
                  ...prev.pagination,
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                },
              }));
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default ResidentStatistic;
