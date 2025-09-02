import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/adminLayout";
import { message, notification, Tabs, type TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { StallCategoryTable, StallTable } from "../../../components";

const Stall = () => {
  const [activeTab, setActiveTab] = useState("stall");
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const items: TabsProps["items"] = [
    {
      key: "stall",
      label: t("stall.list"),
      children: (
        <StallTable
          activeTab={activeTab}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
        />
      ),
    },
    {
      key: "stall_category",
      label: t("stall_category.list"),
      children: (
        <StallCategoryTable
          activeTab={activeTab}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
        />
      ),
    },
  ];

  const handleChangeTab = (tab: string) => {
    const query = new URLSearchParams();
    query.set("tab", tab);
    setActiveTab(tab);
    navigate({ search: query.toString() });
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  return (
    <AdminLayout
      pageName={t("stall.title")}
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
          title: t("stall.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={items}
        type="card"
        activeKey={activeTab}
        defaultActiveKey={activeTab}
        size="middle"
        onChange={handleChangeTab}
      />
    </AdminLayout>
  );
};

export default Stall;
