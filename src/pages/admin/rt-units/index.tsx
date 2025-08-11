import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Card, Col, Form, message, notification, Row, Typography } from "antd";
import { getRTUnit } from "../../../apis";
import { processFail } from "../../../helpers/process";
import { RTUnitForm, RTUnitTable } from "../../../components";
import type { RTUnitExtends, RTUnitTableParams } from "../../../models/rtUnit";
import type { Option } from "../../../models/global";
import type { RWUnitModel } from "../../../models/rwUnit";
import type { AxiosError } from "axios";

const RTUnit = () => {
  const [tableParams, setTableParams] = useState<RTUnitTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 5,
      current: 1,
    },
    search: "",
  });
  const [dataSource, setDataSource] = useState<RTUnitExtends[]>([]);
  const [optionCitizen, setOptionCitizen] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getRTUnit({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
      });
      const { rw_units, rows, total } = response.data;

      const options = rw_units.map((item: RWUnitModel) => {
        return {
          label: item.code,
          value: item.id,
        };
      });
      setOptionCitizen(options);
      setDataSource(rows);
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

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName={t("rt.title")}
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
        {
          title: t("rt.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} lg={12} md={12} xl={10} xxl={10}>
            <RTUnitForm
              fetchData={fetchData}
              form={form}
              id={id}
              messageApi={messageApi}
              notificationApi={notificationApi}
              optionCitizen={optionCitizen}
              setId={setId}
              t={t}
            />
          </Col>
          <Col sm={24} xs={24} lg={12} md={12} xl={14} xxl={14}>
            <Typography.Title level={3}>{t("rt.list")}</Typography.Title>
            <RTUnitTable
              dataSource={dataSource}
              fetchData={fetchData}
              form={form}
              loading={loading}
              messageApi={messageApi}
              notificationApi={notificationApi}
              setId={setId}
              setTableParams={setTableParams}
              t={t}
              tableParams={tableParams}
            />
          </Col>
        </Row>
      </Card>
    </AdminLayout>
  );
};

export default RTUnit;
