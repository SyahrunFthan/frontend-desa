import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { message, notification, Tabs, type TabsProps } from "antd";
import { useEffect, useState } from "react";
import {
  SubmissionServiceHistoryTable,
  SubmissionServiceTable,
} from "../../../components";

const SubmissionService = () => {
  const [activeTab, setActiveTab] = useState("list-submission");
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeTab = (key: string) => {
    const query = new URLSearchParams();
    query.set("tab", key);
    setActiveTab(key);
    navigate({ search: query.toString() });
  };

  const items: TabsProps["items"] = [
    {
      key: "list-submission",
      label: t("submissionService.list"),
      children: (
        <SubmissionServiceTable
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
        />
      ),
    },
    {
      key: "history-submission",
      label: t("submissionService.historyList"),
      children: (
        <SubmissionServiceHistoryTable
          messageApi={messageApi}
          notificationApi={notificationApi}
          activeTab={activeTab}
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
      pageName={t("submissionService.title")}
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
          title: t("submissionService.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={items}
        activeKey={activeTab}
        defaultActiveKey={activeTab}
        type="card"
        size="middle"
        onChange={handleChangeTab}
      />
    </AdminLayout>
  );
};

export default SubmissionService;
