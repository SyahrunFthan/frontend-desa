import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { Card, Flex, Form, message, notification, Typography } from "antd";
import { PeriodCreate, PeriodTable } from "../../../components";
import { useEffect, useState } from "react";
import type { PeriodModel, PeriodTableParams } from "../../../models/period";
import { getPeriod } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const Period = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const [tableParams, setTableParams] = useState<PeriodTableParams>({
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
      year: "",
    },
  });
  const [dataSource, setDataSource] = useState<PeriodModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getPeriod({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      setDataSource(response.data.rows);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data.total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchData",
        axiosError.response?.data.message || "Server Error"
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
    <AdminLayout
      pageName={t("periods")}
      breadCrumbs={[
        {
          title: (
            <Link to="/admin/dashboard">
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
        {
          title: t("periods"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <Typography.Title level={3}>{t("period.title")}</Typography.Title>

        <Flex flex={2}>
          <PeriodCreate
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            form={form}
            id={id}
            setId={setId}
          />
          <div className="w-full">
            <PeriodTable
              dataSource={dataSource}
              messageApi={messageApi}
              notificationApi={notificationApi}
              setTableParams={setTableParams}
              t={t}
              tableParams={tableParams}
              loading={loading}
              fetchData={fetchData}
              form={form}
              setId={setId}
            />
          </div>
        </Flex>
      </Card>
    </AdminLayout>
  );
};

export default Period;
