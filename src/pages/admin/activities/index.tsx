import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import {
  activityState,
  type ActivityModel,
  type ActivityTableParams,
} from "../../../models/activity";
import { Card, Col, Drawer, message, notification, Row } from "antd";
import {
  ActivityCreate,
  ActivityEdit,
  ActivityTable,
} from "../../../components";
import { getActivity } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const Activity = () => {
  const [tableParams, setTableParams] = useState<ActivityTableParams>({
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
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ActivityModel[]>([]);
  const [record, setRecord] = useState<ActivityModel>(activityState);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getActivity({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
      });
      const { total, activities } = response.data;
      setDataSource(activities);
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
      pageName={t("activity.title")}
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
          title: t("activity.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} lg={12} md={12} xl={10} xxl={10}>
            <ActivityCreate
              messageApi={messageApi}
              notificationApi={notificationApi}
              t={t}
              fetchData={fetchData}
            />
          </Col>
          <Col sm={24} xs={24} lg={12} md={12} xl={14} xxl={14}>
            <ActivityTable
              setTableParams={setTableParams}
              t={t}
              tableParams={tableParams}
              dataSource={dataSource}
              loading={loading}
              fetchData={fetchData}
              messageApi={messageApi}
              notificationApi={notificationApi}
              setOpenDrawer={setOpenDrawer}
              setRecord={setRecord}
            />
          </Col>
        </Row>
      </Card>

      <Drawer open={openDrawer} closable={false} title={t("activity.edit")}>
        <ActivityEdit
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          record={record}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
          t={t}
          key={record.id}
        />
      </Drawer>
    </AdminLayout>
  );
};

export default Activity;
