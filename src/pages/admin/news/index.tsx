import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { NewsModel, NewsTableParams } from "../../../models/news";
import { Drawer, message, notification, Tabs, type TabsProps } from "antd";
import { NewsCreate, NewsEdit, NewsTable } from "../../../components";
import { getNews } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const News = () => {
  const [tableParams, setTableParams] = useState<NewsTableParams>({
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
  const [activeTab, setActiveTab] = useState("list");
  const [record, setRecord] = useState<NewsModel | null>(null);
  const [dataSource, setDataSource] = useState<NewsModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getNews({
        current: tableParams.pagination?.current ?? 1,
        pageSize: tableParams.pagination?.pageSize ?? 5,
        search: tableParams.search ?? "",
      });
      const { total, news } = response.data;
      setDataSource(news);
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

  const handleChangeTab = (key: string) => {
    const query = new URLSearchParams();
    query.set("tab", key);
    setActiveTab(key);
    navigate({ search: query.toString() });
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "list",
      label: t("news.list"),
      children: (
        <NewsTable
          dataSource={dataSource}
          fetchData={fetchData}
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setTableParams={setTableParams}
          tableParams={tableParams}
          t={t}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
        />
      ),
    },
    {
      key: "create",
      label: t("news.create"),
      children: (
        <NewsCreate
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
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName={t("news.title")}
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
          title: t("news.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={tabItems}
        activeKey={activeTab}
        type="card"
        size="middle"
        onChange={handleChangeTab}
        defaultActiveKey={activeTab}
      />

      {record !== null && openDrawer && (
        <Drawer
          key={record.id}
          open={openDrawer}
          closable={false}
          title={t("news.edit")}
        >
          <NewsEdit
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            record={record}
            setRecord={setRecord}
            setOpenDrawer={setOpenDrawer}
            t={t}
          />
        </Drawer>
      )}
    </AdminLayout>
  );
};

export default News;
