import AdminLayout from "../../../layouts/adminLayout";
import { DashboardOutlined, IdcardOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import {
  FamilyCardDescription,
  FamilyCardListResident,
} from "../../../components";
import { useEffect, useState } from "react";
import type {
  ResidentModel,
  ResidentTableParams,
} from "../../../models/resident";
import { getFamilyCardId } from "../../../apis";
import type { AxiosError } from "axios";
import { message } from "antd";
import { processFail } from "../../../helpers/process";
import type { FamilyCardModel } from "../../../models/familyCard";

const FamilyCardDetail = () => {
  const { id } = useParams();

  const [tableParams, setTableParams] = useState<ResidentTableParams>({
    pagination: {
      showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} items`,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showSizeChanger: true,
      total: 0,
      pageSize: 5,
      current: 1,
    },
  });
  const [dataSource, setDataSource] = useState<ResidentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [familyCard, setFamilyCard] = useState<FamilyCardModel>({
    address: "",
    family_id: "",
    total_family: 0,
    id: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getFamilyCardId({
        id: id,
        pageSize: tableParams.pagination?.pageSize || 5,
        current: tableParams.pagination?.current || 1,
      });
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data.total,
        },
      }));
      setFamilyCard(response.data.familyCard);
      setDataSource(response.data.residents);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status == 404) {
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
      pageName="Detail 2739128318299"
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
            <Link
              to={"/admin/family-cards"}
              className="flex items-center gap-1"
            >
              <IdcardOutlined />
              <span className="ml-1">Family Card</span>
            </Link>
          ),
        },
        {
          title: (
            <div className="flex items-center gap-1">
              <span>Detail</span>
            </div>
          ),
        },
      ]}
    >
      {contextHolder}

      <FamilyCardDescription familyCard={familyCard} />
      <FamilyCardListResident
        tableParams={tableParams}
        dataSource={dataSource}
        setTableParams={setTableParams}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default FamilyCardDetail;
