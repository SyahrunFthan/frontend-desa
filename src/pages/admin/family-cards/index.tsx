import { Col, message, notification, Row } from "antd";
import AdminLayout from "../../../layouts/adminLayout";
import { DashboardOutlined } from "@ant-design/icons";
import { FamilyCardCreate, FamilyCardList } from "../../../components";
import { useEffect, useState } from "react";
import type {
  FamilyCardModel,
  FamilyCardTableParams,
} from "../../../models/familyCard";
import type { AxiosError } from "axios";
import { getFamilyCard } from "../../../apis";
import { processFail } from "../../../helpers/process";
import { Link } from "react-router-dom";

const FamilyCard = () => {
  const [tableParams, setTableParams] = useState<FamilyCardTableParams>({
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
      family_id: "",
      address: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<FamilyCardModel[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();

  const fetchFamilyCard = async () => {
    try {
      setLoading(true);
      const response = await getFamilyCard({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data?.total,
        },
      }));
      setDataSource(response.data?.response);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError.response);
      processFail(
        messageApi,
        "fetchFamilyCard",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchFamilyCard();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  return (
    <AdminLayout
      pageName="Family Cards"
      breadCrumbs={[
        {
          title: (
            <Link to={"/admin/dashboard"}>
              <DashboardOutlined />
              <span className="ml-1">Dashboard</span>
            </Link>
          ),
        },
        {
          title: (
            <div className="flex items-center gap-1">
              <span>Family Card</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={12} lg={12} xl={8} xxl={8}>
          <FamilyCardCreate
            messageApi={messageApi}
            notificationApi={notificationApi}
            fetchFamilyCard={fetchFamilyCard}
          />
        </Col>
        <Col sm={24} xs={24} md={12} lg={12} xl={16} xxl={16}>
          <FamilyCardList
            messageApi={messageApi}
            notificationApi={notificationApi}
            tableParams={tableParams}
            dataSource={dataSource}
            loading={loading}
            setTableParams={setTableParams}
            fetchFamilyCard={fetchFamilyCard}
          />
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default FamilyCard;
