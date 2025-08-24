import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Drawer, message, notification, Tabs, type TabsProps } from "antd";
import { DevelopmentCreate, DevelopmentTable } from "../../../components";
import {
  developmentState,
  type DevelopmentModel,
  type DevelopmentTableParams,
} from "../../../models/development";
import { getDevelopment } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import DevelopmentEdit from "../../../components/developments/DevelopmentEdit";

const Development = () => {
  const [tableParams, setTableParams] = useState<DevelopmentTableParams>({
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
      end_at: "",
      name: "",
      source_of_fund: "",
      start_at: "",
      status: "",
      volume: "",
    },
  });
  const [dataSource, setDataSource] = useState<DevelopmentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("development");
  const [record, setRecord] = useState<DevelopmentModel>(developmentState);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getDevelopment({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });
      const { total, developments } = response.data;
      setDataSource(developments);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...tableParams.pagination,
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

  const handleChangeTab: TabsProps["onChange"] = (key) => {
    const query = new URLSearchParams();
    query.set("tab", key);
    setActiveTab(key);
    navigate({ search: query.toString() });
  };

  const items: TabsProps["items"] = [
    {
      key: "development",
      label: t("development.list"),
      children: (
        <DevelopmentTable
          dataSource={dataSource}
          fetchData={fetchData}
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
        />
      ),
    },
    {
      key: "create",
      label: t("development.create"),
      children: (
        <DevelopmentCreate
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
        />
      ),
    },
  ];

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  return (
    <AdminLayout
      pageName={t("development.title")}
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">{t("dashboard")}</span>
            </Link>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={items}
        accessKey={activeTab}
        defaultActiveKey={activeTab}
        size="middle"
        type="card"
        onChange={handleChangeTab}
      />

      <Drawer
        open={openDrawer}
        closable={false}
        title={t("development.edit")}
        width={520}
        key={record.id}
      >
        <DevelopmentEdit
          record={record}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
          t={t}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      </Drawer>
    </AdminLayout>
  );
};

export default Development;
