import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useParams } from "react-router-dom";
import { DashboardOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type {
  FacilityModel,
  FacilityTableParams,
} from "../../../models/facility";
import { getRegionId } from "../../../apis";
import type { RegionModel } from "../../../models/region";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { Card, Col, message, notification, Row } from "antd";
import { RegionDescription, RegionFacilityTable } from "../../../components";

const RegionDetail = () => {
  const [tableParams, setTableParams] = useState<FacilityTableParams>({
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
  const [dataSource, setDataSource] = useState<FacilityModel[]>([]);
  const [region, setRegion] = useState<RegionModel | null>(null);
  const [totalResident, setTotalResident] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();

  const { id } = useParams();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getRegionId({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
        id: id,
      });
      const { region, total, facilities, totalResident } = response.data;

      setDataSource(facilities);
      setRegion(region);
      setTotalResident(totalResident);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total,
        },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 404) {
        processFail(
          messageApi,
          "fetchData",
          axiosError.response?.data?.message || "Not Found"
        );
      } else {
        processFail(
          messageApi,
          "fetchData",
          axiosError.response?.data?.message || "Server Error"
        );
      }
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
      pageName={region?.name}
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
      {contextHolder}
      {contextHolderN}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <RegionDescription
              region={region}
              total={tableParams.pagination?.total}
              totalResident={totalResident}
              t={t}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <RegionFacilityTable
              dataSource={dataSource}
              fetchData={fetchData}
              loading={loading}
              messageApi={messageApi}
              notificationApi={notificationApi}
              setTableParams={setTableParams}
              t={t}
              tableParams={tableParams}
              region_id={region?.id || ""}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default RegionDetail;
