import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Card, Drawer, message, notification } from "antd";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import {
  FacilityCreate,
  FacilityEdit,
  FacilityTable,
} from "../../../components";
import { useEffect, useState } from "react";
import {
  facilityState,
  type FacilityModel,
  type FacilityTableParams,
} from "../../../models/facility";
import { getFacility } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const Facility = () => {
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
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [record, setRecord] = useState<FacilityModel>(facilityState);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getFacility({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
      });
      const { total, facilities } = response.data;
      setDataSource(facilities);
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

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName={t("facility.title")}
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
          title: t("facility.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Card>
        <FacilityTable
          dataSource={dataSource}
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          fetchData={fetchData}
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          setRecord={setRecord}
        />
      </Card>

      <Drawer
        open={openCreate}
        title={t("facility.createOf")}
        closable={false}
        width={520}
      >
        <FacilityCreate
          t={t}
          setOpenDrawer={setOpenCreate}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      </Drawer>

      {openEdit && (
        <Drawer
          open={openEdit}
          closable={false}
          title={t("facility.edit")}
          width={520}
          key={record.id}
        >
          <FacilityEdit
            fetchData={fetchData}
            messageApi={messageApi}
            notificationApi={notificationApi}
            record={record}
            setOpenDrawer={setOpenEdit}
            setRecord={setRecord}
            t={t}
          />
        </Drawer>
      )}
    </AdminLayout>
  );
};

export default Facility;
