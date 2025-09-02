import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import type { Stalls, StallTableParams } from "../../models/stall";
import { Card, Table, Typography } from "antd";
import { stallColumns } from "../../constants/stallColumns";
import { getStall } from "../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../helpers/process";
import { stallDeleted } from "../../services/stall";

interface Props {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  activeTab: string;
}

const StallTable = (params: Props) => {
  const { messageApi, notificationApi, t, activeTab } = params;

  const [tableParams, setTableParams] = useState<StallTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 5,
      current: 1,
    },
    filters: {
      category_id: "",
      name: "",
      status: "",
      phone_number: "",
      resident_id: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dataSource, setDataSource] = useState<Stalls[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getStall({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        ...tableParams.filters,
      });
      const { total, stalls } = response.data;
      setDataSource(stalls);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchDataStall",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const handleDelete = (id: string) => {
    stallDeleted({
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const columns = stallColumns({
    handleDelete,
    processing,
    setTableParams,
    t,
    tableParams,
  });

  useEffect(() => {
    fetchData();
  }, [
    activeTab === "stall",
    tableParams.pagination?.pageSize,
    tableParams.pagination?.current,
    tableParams.filters,
  ]);

  return (
    <Card>
      <Typography.Title level={3}>{t("stall.list")}</Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        loading={loading}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        bordered
        onChange={(pagination) => {
          setTableParams((prev) => ({
            ...prev,
            pagination: {
              pageSize: pagination.pageSize,
              current: pagination.current,
            },
          }));
        }}
      />
    </Card>
  );
};

export default StallTable;
