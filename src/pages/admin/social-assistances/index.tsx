import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { message, notification, Tabs, type TabsProps } from "antd";
import { useEffect, useState } from "react";
import {
  AssistanceCategory,
  SocialAssistanceComponent,
} from "../../../components";

const SocialAssistance = () => {
  const [activeTab, setActiveTab] = useState("social_assistance");
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeTab: TabsProps["onChange"] = (tab) => {
    const query = new URLSearchParams();
    query.set("tab", tab);
    setActiveTab(tab);
    navigate({ search: query.toString() });
  };

  const items: TabsProps["items"] = [
    {
      key: "social_assistance",
      label: t("social_assistance.list"),
      children: (
        <SocialAssistanceComponent
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
          activeTab={activeTab}
        />
      ),
    },
    {
      key: "social_assistance_category",
      label: t("social_assistance.category.list"),
      children: (
        <AssistanceCategory
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

  return (
    <AdminLayout
      pageName={t("social_assistance.title")}
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
          title: t("social_assistance.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={items}
        type="card"
        accessKey={activeTab ?? "social_assistance"}
        defaultActiveKey={activeTab}
        onChange={handleChangeTab}
      />
    </AdminLayout>
  );
};

export default SocialAssistance;
