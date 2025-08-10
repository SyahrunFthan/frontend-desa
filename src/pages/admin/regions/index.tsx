import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { Form, message, notification, Tabs, type TabsProps } from "antd";
import { useEffect, useState } from "react";
import type { RegionModel, RegionTableParams } from "../../../models/region";
import { RegionCreate, RegionEdit, RegionTable } from "../../../components";
import { getRegion } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import type { Option } from "../../../models/global";
import type { EmployeeModel } from "../../../models/employee";

const Region = () => {
  const [tableParams, setTableParams] = useState<RegionTableParams>({
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
  const [id, setId] = useState("");
  const [regions, setRegions] = useState<RegionModel[]>([]);
  const [dataSource, setDataSource] = useState<RegionModel[]>([]);
  const [optionLeader, setOptionLeader] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contexhHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const handleChangeTab: TabsProps["onChange"] = (tab) => {
    const query = new URLSearchParams();
    query.set("tab", tab);
    setActiveTab(tab);
    navigate({ search: query.toString() });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getRegion({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        search: tableParams.search || "",
      });

      const leaders = response.data.leaders.map((item: EmployeeModel) => {
        return {
          label: item.fullname,
          value: item.id,
        };
      });

      setOptionLeader(leaders);
      setDataSource(response.data.rows);
      setRegions(response.data.regions);
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: response.data.total,
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

  const items: TabsProps["items"] = [
    {
      key: "list",
      label: t("region.list"),
      children: (
        <RegionTable
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
          tableParams={tableParams}
          setTableParams={setTableParams}
          loading={loading}
          dataSource={dataSource}
          form={form}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
        />
      ),
    },
    {
      key: "create",
      label: t("region.create"),
      children: (
        <RegionCreate
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
          optionLeader={optionLeader}
          fetchData={fetchData}
          regions={regions}
        />
      ),
    },
  ];

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab && ["list", "create"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <AdminLayout
      pageName={t("region.title")}
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
          title: t("region.title"),
        },
      ]}
    >
      {contextHolder}
      {contexhHolderN}

      <Tabs
        items={items}
        size="middle"
        style={{ width: "100%" }}
        type="card"
        defaultActiveKey="list"
        activeKey={activeTab ?? "list"}
        onChange={handleChangeTab}
      />

      {openDrawer && (
        <RegionEdit
          fetchData={fetchData}
          form={form}
          id={id}
          messageApi={messageApi}
          notificationApi={notificationApi}
          openDrawer={openDrawer}
          optionLeader={optionLeader}
          regions={regions}
          setId={setId}
          setOpenDrawer={setOpenDrawer}
          t={t}
        />
      )}
    </AdminLayout>
  );
};

export default Region;
