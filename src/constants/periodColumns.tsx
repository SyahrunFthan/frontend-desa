import type { TFunction } from "i18next";
import type { PeriodModel, PeriodTableParams } from "../models/period";
import { searchColumns } from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip, type UploadFile } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import { PeriodUpload } from "../components";
import type { IncomeModel, IncomeTableParams } from "../models/income";
import type { ExpenseModel, ExpenseTableParams } from "../models/expense";

interface ColumnProps {
  handleDelete: (id: string) => void;
  handleEdit: (record: PeriodModel) => void;
  setTableParams: (params: PeriodTableParams) => void;
  setFile: (file: UploadFile[] | null) => void;
  fetchData: () => void;
  tableParams: PeriodTableParams;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  t: TFunction;
  file: UploadFile[] | null;
  processing: boolean;
}

export const periodColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  t,
  tableParams,
  messageApi,
  notificationApi,
  fetchData,
}: ColumnProps): ColumnsType<PeriodModel> => {
  return [
    {
      key: "no",
      title: "No.",
      render: (_, __, index) => {
        const pageSize = Number(tableParams.pagination?.pageSize);
        const current = Number(tableParams.pagination?.current);
        const start = (current - 1) * pageSize + index + 1;

        return start;
      },
      width: "5%",
      align: "center",
    },
    {
      key: "year",
      title: t("period.year"),
      dataIndex: "year",
      ...searchColumns<PeriodModel>("tahun", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            year: value,
          },
        });
      }),
      sorter: (a, b) => a.year.localeCompare(b.year),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <Link className="text-blue-500" to={`/admin/period/${record.id}`}>
            {value}
          </Link>
        );
      },
    },
    {
      key: "description",
      dataIndex: "description",
      title: t("period.description"),
      sorter: (a, b) => a.description.localeCompare(b.description),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return value ? value : "-";
      },
    },
    {
      key: "file",
      dataIndex: "file",
      title: t("period.file"),
      sorter: (a, b) => (a.file || "").localeCompare(b.file || ""),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return (
          <PeriodUpload
            value={value}
            path_file={record.path_file}
            id={record.id}
            messageApi={messageApi}
            notificationApi={notificationApi}
            fetchData={fetchData}
          />
        );
      },
    },
    {
      key: "action",
      title: "#",
      dataIndex: "id",
      align: "center",
      width: "10%",
      fixed: "right",
      render: (value, record) => {
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="link"
                disabled={processing}
                onClick={() => handleEdit(record)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Popconfirm
              title={`Confirm delete ${record?.year}?`}
              onConfirm={() => handleDelete(value)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button danger type="link" disabled={processing}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};

interface ColumnIncomeDetailProps {
  tableParams: IncomeTableParams;
  setTableParams: (params: IncomeTableParams) => void;
  t: TFunction;
}

export const incomePeriodColumns = ({
  setTableParams,
  tableParams,
  t,
}: ColumnIncomeDetailProps): ColumnsType<IncomeModel> => {
  return [
    {
      key: "code",
      title: t("incomes.code"),
      dataIndex: "code",
      ...searchColumns<IncomeModel>("code", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            code: value,
          },
        });
      }),
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "name",
      title: t("incomes.name"),
      dataIndex: "name",
      width: "30%",
      ...searchColumns<IncomeModel>("name", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            name: value,
          },
        });
      }),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "abbreviation",
      title: t("incomes.abbreviation"),
      dataIndex: "abbreviation",
      ...searchColumns<IncomeModel>("abbreviation", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            abbreviation: value,
          },
        });
      }),
      sorter: (a, b) => a.abbreviation.localeCompare(b.abbreviation),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return <Tag color="green">{value}</Tag>;
      },
    },
    {
      key: "amount",
      title: t("incomes.amount"),
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const num = Number(value ?? 0);
        return `Rp ${num.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
  ];
};

interface ColumnExpenseDetailProps {
  tableParams: ExpenseTableParams;
  setTableParams: (params: ExpenseTableParams) => void;
  t: TFunction;
}

export const expensePeriodColumns = ({
  setTableParams,
  tableParams,
  t,
}: ColumnExpenseDetailProps): ColumnsType<ExpenseModel> => {
  return [
    {
      key: "code",
      title: t("expense.code"),
      dataIndex: "code",
      ...searchColumns<ExpenseModel>("code", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            code: value,
          },
        });
      }),
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "name",
      title: t("expense.name"),
      dataIndex: "name",
      ...searchColumns<ExpenseModel>("name", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            name: value,
          },
        });
      }),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "funding_source_id",
      title: t("expense.funding_source_id"),
      dataIndex: "funding_source_id",
      sorter: (a, b) => a.funding_source_id.localeCompare(b.funding_source_id),
      sortDirections: ["ascend", "descend"],
      render: (_, record) => {
        return <Tag color="green">{record.income.abbreviation}</Tag>;
      },
    },
    {
      key: "amount",
      title: t("expense.amount"),
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const num = Number(value ?? 0);
        return `Rp ${num.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
  ];
};
