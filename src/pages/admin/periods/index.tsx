import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { Card, Flex, message, notification, Typography } from "antd";
import { PeriodCreate } from "../../../components";

const Period = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = () => {};

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
          />
          <div className="w-full"></div>
        </Flex>
      </Card>
    </AdminLayout>
  );
};

export default Period;
