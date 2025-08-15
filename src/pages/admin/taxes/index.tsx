import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Drawer, message, notification, Tabs, type TabsProps } from "antd";
import {
  taxState,
  type Taxes,
  type TaxModel,
  type TaxTableParams,
} from "../../../models/tax";
import { TaxCreate, TaxEdit, TaxTable } from "../../../components";
import { getTax } from "../../../apis";
import type { Option } from "../../../models/global";
import type { ResidentModel } from "../../../models/resident";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";

const Tax = () => {
  const [tableParams, setTableParams] = useState<TaxTableParams>({
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
      reference_number: "",
      resident_id: "",
      status: "",
      taxpayer_address: "",
      taxpayer_name: "",
    },
  });
  const [activeTab, setActiveTab] = useState("tax");
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dataSource, setDataSource] = useState<Taxes[]>([]);
  const [optionResident, setOptionResident] = useState<Option[]>([]);
  const [record, setRecord] = useState<TaxModel>(taxState);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getTax({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const { residents, total, taxes } = response.data;

      const resident = residents.map((item: ResidentModel) => {
        return {
          label: `${item.resident_id}-${item.fullname}`,
          value: item.id,
        };
      });
      setOptionResident(resident);
      setDataSource(taxes);
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

  const handleChangeTab: TabsProps["onChange"] = (tab) => {
    const query = new URLSearchParams();
    query.set("tab", tab);
    setActiveTab(tab);
    navigate({ search: query.toString() });
  };

  const items: TabsProps["items"] = [
    {
      key: "tax",
      label: t("tax.list"),
      children: (
        <TaxTable
          dataSource={dataSource}
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          fetchData={fetchData}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
        />
      ),
    },
    {
      key: "create",
      label: t("tax.create"),
      children: (
        <TaxCreate
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
          optionResident={optionResident}
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

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.filters,
  ]);

  return (
    <AdminLayout
      pageName={t("tax.title")}
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
          title: t("tax.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        items={items}
        accessKey={activeTab}
        defaultActiveKey={activeTab}
        type="card"
        size="middle"
        onChange={handleChangeTab}
      />

      <Drawer open={openDrawer} closable={false} title={t("tax.edit")}>
        <TaxEdit
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          optionResident={optionResident}
          record={record}
          setOpenDrawer={setOpenDrawer}
          setRecord={setRecord}
          t={t}
        />
      </Drawer>
    </AdminLayout>
  );
};

export default Tax;
