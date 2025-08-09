import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/adminLayout";
import { DashboardOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type {
  ExpenseModel,
  ExpenseTableParams,
  Statistic,
} from "../../../models/expense";
import { Form, message, notification, Tabs, type TabsProps } from "antd";
import {
  ExpenseCreate,
  ExpenseEdit,
  ExpenseStatistic,
  ExpenseTable,
} from "../../../components";
import type { IncomeOption, Option } from "../../../models/global";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { getExpense } from "../../../apis";
import type { IncomeModel } from "../../../models/income";
import type { PeriodModel } from "../../../models/period";

const Expense = () => {
  const [tableParams, setTableParams] = useState<ExpenseTableParams>({
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
      code: "",
      name: "",
      period_id: "",
    },
  });
  const [dataSource, setDataSource] = useState<ExpenseModel[]>([]);
  const [id, setId] = useState("");
  const [activeTab, setActiveTab] = useState("expense");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [incomes, setIncomes] = useState<IncomeOption[]>([]);
  const [periods, setPeriods] = useState<Option[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const [formEdit] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getExpense({
        current: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 5,
        filters: tableParams.filters,
      });

      const incomes = response.data.fundingSources.map((item: IncomeModel) => {
        return {
          label: item.abbreviation,
          value: item.id,
          period_id: item.period_id,
        };
      });
      const periods = response.data.periods.map((item: PeriodModel) => {
        return {
          label: item.year,
          value: item.id,
        };
      });

      setStatistics(response.data.statistics);
      setIncomes(incomes);
      setPeriods(periods);
      setDataSource(response.data.expenses);
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

  const handleChangeTab: TabsProps["onChange"] = (tab) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    setActiveTab(tab);
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
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
      key: "expense",
      label: t("expense.list"),
      children: (
        <ExpenseTable
          loading={loading}
          messageApi={messageApi}
          notificationApi={notificationApi}
          setTableParams={setTableParams}
          t={t}
          tableParams={tableParams}
          dataSource={dataSource}
          incomes={incomes}
          periods={periods}
          fetchData={fetchData}
          form={formEdit}
          setId={setId}
          setOpen={setOpen}
        />
      ),
    },
    {
      key: "create",
      label: t("expense.create"),
      children: (
        <ExpenseCreate
          fetchData={fetchData}
          messageApi={messageApi}
          notificationApi={notificationApi}
          t={t}
          incomes={incomes}
          periods={periods}
        />
      ),
    },
    {
      key: "statistic",
      label: t("expense.statistic"),
      children: <ExpenseStatistic t={t} statistics={statistics} />,
    },
  ];

  return (
    <AdminLayout
      pageName={t("expense.title")}
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
          title: t("expense.title"),
        },
      ]}
    >
      {contextHolder}
      {contextHolderN}
      <Tabs
        items={items}
        size="middle"
        activeKey={activeTab}
        defaultActiveKey="expense"
        type="card"
        onChange={handleChangeTab}
      />

      {open && (
        <ExpenseEdit
          fetchData={fetchData}
          form={formEdit}
          id={id}
          setId={setId}
          setOpen={setOpen}
          incomes={incomes}
          messageApi={messageApi}
          notificationApi={notificationApi}
          open={open}
          periods={periods}
          t={t}
        />
      )}
    </AdminLayout>
  );
};

export default Expense;
