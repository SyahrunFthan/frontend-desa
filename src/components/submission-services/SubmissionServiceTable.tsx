import { Card, Form, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { submissionServiceColumns } from "../../constants/submissionServiceColumns";
import { getSubmissionService } from "../../apis";
import { processFail } from "../../helpers/process";
import type {
  SubmissionServices,
  SubmissionServiceTableParams,
} from "../../models/submissionService";
import type { TFunction } from "i18next";
import type { AxiosError } from "axios";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { submissionServiceUpdateStatus } from "../../services/submissionService";

interface Props {
  t: TFunction;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
}

const SubmissionServiceTable = (params: Props) => {
  const [tableParams, setTableParams] = useState<SubmissionServiceTableParams>({
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
      code: "",
      resident_id: "",
      service_id: "",
      date_of_submission: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dataSource, setDataSource] = useState<SubmissionServices[]>([]);
  const { t, messageApi, notificationApi } = params;
  const [form] = Form.useForm();

  const handleDelete = (id: string, note?: string) => {
    const data = {
      code: null,
      status_submission: "rejected",
      note: note ?? "",
    };

    submissionServiceUpdateStatus({
      form,
      data,
      fetchData,
      id,
      messageApi,
      notificationApi,
      setProcessing,
    });
  };

  const columns = submissionServiceColumns({
    form,
    handleDelete,
    processing,
    setTableParams,
    t,
    tableParams,
    isHidden: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSubmissionService({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const { total, submissions } = response.data;
      setDataSource(submissions);
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
        "fetchDataSubmission",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  return (
    <Card>
      <Typography.Title level={3}>
        {t("submissionService.list")}
      </Typography.Title>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        loading={loading}
        rowKey={"id"}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default SubmissionServiceTable;
