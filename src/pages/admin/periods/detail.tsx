import AdminLayout from "../../../layouts/adminLayout";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { CalendarOutlined, DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { IncomeModel, IncomeTableParams } from "../../../models/income";
import type { ExpenseModel, ExpenseTableParams } from "../../../models/expense";
import type { AxiosError } from "axios";
import { processFail } from "../../../helpers/process";
import { Card, Col, message, Row, Table, Typography } from "antd";
import {
  expensePeriodColumns,
  incomePeriodColumns,
} from "../../../constants/periodColumns";
import { getPeriodIdExpense, getPeriodIdIncome } from "../../../apis";

const PeriodDetail = () => {
  const [tableParamIncomes, setTableParamIncomes] = useState<IncomeTableParams>(
    {
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
        code: "",
        name: "",
      },
    }
  );
  const [tableParamExpenses, setTableParamExpenses] =
    useState<ExpenseTableParams>({
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
      },
    });

  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(false);
  const [dataSourceIncome, setDataSourceIncome] = useState<IncomeModel[]>([]);
  const [dataSourceExpense, setDataSourceExpense] = useState<ExpenseModel[]>(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchIncome = async () => {
    try {
      setLoadingIncome(true);
      const res = await getPeriodIdIncome({
        current: tableParamIncomes.pagination?.current || 1,
        pageSize: tableParamIncomes.pagination?.pageSize || 5,
        filters: tableParamIncomes.filters,
        id,
      });

      const { incomes, total } = res.data;
      setDataSourceIncome(incomes);
      setTableParamIncomes((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, total },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchIncome",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoadingIncome(false);
      }, 200);
    }
  };

  const fetchExpense = async () => {
    try {
      setLoadingExpense(true);
      const res = await getPeriodIdExpense({
        current: tableParamExpenses.pagination?.current || 1,
        pageSize: tableParamExpenses.pagination?.pageSize || 5,
        filters: tableParamExpenses.filters,
        id,
      });

      const { expenses, total } = res.data;
      setDataSourceExpense(expenses);
      setTableParamExpenses((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, total: total },
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      processFail(
        messageApi,
        "fetchExpense",
        axiosError.response?.data?.message || "Server Error"
      );
    } finally {
      setTimeout(() => {
        setLoadingExpense(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [
    tableParamIncomes.pagination?.current,
    tableParamIncomes.pagination?.pageSize,
    tableParamIncomes.filters,
  ]);

  useEffect(() => {
    fetchExpense();
  }, [
    tableParamExpenses.pagination?.current,
    tableParamExpenses.pagination?.pageSize,
    tableParamExpenses.filters,
  ]);

  return (
    <AdminLayout
      pageName={t("period.detail.title")}
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
          title: (
            <Link to={"/admin/period"}>
              <CalendarOutlined />
              <span className="ml-1">{t("periods")}</span>
            </Link>
          ),
        },
        {
          title: t("period.detail.title"),
        },
      ]}
    >
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Typography.Title level={3}>{t("incomes.list")}</Typography.Title>

            <Table
              columns={incomePeriodColumns({
                tableParams: tableParamIncomes,
                setTableParams: setTableParamIncomes,
                t,
              })}
              dataSource={dataSourceIncome}
              bordered
              rowKey={"id"}
              loading={loadingIncome}
              pagination={tableParamIncomes.pagination}
              size="middle"
              onChange={(pagination) => {
                setTableParamIncomes((prev) => ({
                  ...prev,
                  pagination: {
                    ...prev.pagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                  },
                }));
              }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Typography.Title level={3}>{t("expense.list")}</Typography.Title>

            <Table
              columns={expensePeriodColumns({
                tableParams: tableParamExpenses,
                setTableParams: setTableParamExpenses,
                t,
              })}
              dataSource={dataSourceExpense}
              bordered
              rowKey={"id"}
              loading={loadingExpense}
              pagination={tableParamExpenses.pagination}
              size="middle"
              onChange={(pagination) => {
                setTableParamExpenses((prev) => ({
                  ...prev,
                  pagination: {
                    ...prev.pagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                  },
                }));
              }}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default PeriodDetail;
