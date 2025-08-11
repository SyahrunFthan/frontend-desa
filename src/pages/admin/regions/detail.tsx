import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link } from "react-router-dom";
import { DashboardOutlined, EnvironmentOutlined } from "@ant-design/icons";

const RegionDetail = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout
      pageName={t("region.detail.title")}
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
          title: (
            <Link to={"/admin/regions"}>
              <EnvironmentOutlined />
              <span className="ml-1">{t("region.title")}</span>
            </Link>
          ),
        },
        {
          title: "Detail",
        },
      ]}
    >
      <div></div>
    </AdminLayout>
  );
};

export default RegionDetail;
