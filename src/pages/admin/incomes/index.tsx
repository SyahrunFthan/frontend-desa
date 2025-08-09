import { useTranslation } from "react-i18next";
import AdminLayout from "../../../layouts/adminLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Form, message, notification, Tabs, type TabsProps } from "antd";
import type {
  IncomeModel,
  IncomeTableParams,
  Statistic,
} from "../../../models/income";
import {
  IncomeCreate,
  IncomeEdit,
  IncomeStatistic,
  IncomeTable,
} from "../../../components";
import type { Option } from "../../../models/global";
import { getIncome } from "../../../apis";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import type { PeriodModel } from "../../../models/period";

const Income = () => {
  const [tableParams, setTableParams] = useState<IncomeTableParams>({
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
      abbreviation: "",
      amount: 0,
      code: "",
      name: "",
      period_id: "",
    },
  });
  const [activeTab, setActiveTab] = useState("income");
  const [id, setId] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [periods, setPeriods] = useState<Option[]>([]);
  const [dataSource, setDataSource] = useState<IncomeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [formEdit] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeTab = (key: string) => {
    const query = new URLSearchParams();
    query.set("tab", key);
    setActiveTab(key);
    navigate({ search: query.toString() });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getIncome({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const periodOptions = response.data.periods.map((item: PeriodModel) => {
        return {
          label: item.year,
          value: item.id,
        };
      });

      setStatistics(response.data.statistics);
      setDataSource(response.data.rows);
      setPeriods(periodOptions);
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

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab && ["income", "create", "statistic"].includes(tab)) {
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

  const items: TabsProps["items"] = [
    {
      key: "income",
      label: t("incomes.list"),
      children: (
        <IncomeTable
          dataSource={dataSource}
          periods={periods}
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          loading={loading}
          formEdit={formEdit}
          setId={setId}
          setIsOpen={setIsOpen}
        />
      ),
    },
    {
      key: "create",
      label: t("incomes.create"),
      children: (
        <IncomeCreate
          t={t}
          periods={periods}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
        />
      ),
    },
    {
      key: "statistic",
      label: t("incomes.statistic"),
      children: <IncomeStatistic t={t} statistics={statistics} />,
    },
  ];

  return (
    <AdminLayout
      pageName={t("income")}
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
          title: t("income"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}

      <Tabs
        size="middle"
        style={{ width: "100%" }}
        activeKey={activeTab ?? "income"}
        type="card"
        defaultActiveKey="income"
        items={items}
        onChange={handleChangeTab}
      />

      {isOpen && (
        <IncomeEdit
          form={formEdit}
          isOpen={isOpen}
          periods={periods}
          setIsOpen={setIsOpen}
          t={t}
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          id={id}
          setId={setId}
        />
      )}
    </AdminLayout>
  );
};

export default Income;
