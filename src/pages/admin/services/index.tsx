import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/adminLayout";
import type { ServiceModel, ServiceTableParams } from "../../../models/service";
import { Card, Col, message, notification, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { getServices } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { ServiceCreate, ServiceEdit, ServiceTable } from "../../../components";

const Service = () => {
  const [tableParams, setTableParams] = useState<ServiceTableParams>({
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
      name: "",
      status_service: "",
      type_service: "",
    },
  });
  const [dataSource, setDataSource] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [id, setId] = useState("");
  const [record, setRecord] = useState<ServiceModel>({
    id: "",
    name: "",
    status_service: "",
    type_service: "",
    template_path: "",
    template_file: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getServices({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });
      const { total, services } = response.data;
      setDataSource(services);
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
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  return (
    <AdminLayout
      pageName={t("service.title")}
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
          title: t("service.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} lg={12} md={12} xl={10} xxl={10}>
            <ServiceCreate
              fetchData={fetchData}
              messageApi={messageApi}
              notificationApi={notificationApi}
              t={t}
            />
          </Col>
          <Col sm={24} xs={24} lg={12} md={12} xl={14} xxl={14}>
            <ServiceTable
              dataSource={dataSource}
              loading={loading}
              messageApi={messageApi}
              notificationApi={notificationApi}
              setRecord={setRecord}
              setId={setId}
              setTableParams={setTableParams}
              t={t}
              tableParams={tableParams}
              fetchData={fetchData}
              setOpenDrawer={setOpenDrawer}
            />
          </Col>
        </Row>
      </Card>

      {openDrawer && (
        <ServiceEdit
          fetchData={fetchData}
          id={id}
          messageApi={messageApi}
          notificationApi={notificationApi}
          openDrawer={openDrawer}
          record={record}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
          t={t}
        />
      )}
    </AdminLayout>
  );
};

export default Service;
