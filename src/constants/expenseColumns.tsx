import type { TFunction } from "i18next";
import type { ExpenseModel, ExpenseTableParams } from "../models/expense";
import type { ColumnsType } from "antd/es/table";
import type { Option } from "../models/global";
import { searchColumns, selectFilterColumn } from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: ExpenseTableParams;
  setTableParams: (params: ExpenseTableParams) => void;
  handleDelete: (id: string) => void;
  handleEdit: (record: ExpenseModel) => void;
  periods: Option[];
  incomes: Option[];
  processing: boolean;
  t: TFunction;
}

export const expenseColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  t,
  tableParams,
  periods,
}: ColumnProps): ColumnsType<ExpenseModel> => {
  return [
    {
      key: "period_id",
      title: t("expense.period"),
      dataIndex: ["period", "year"],
      ...selectFilterColumn<ExpenseModel>("period", periods, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            period_id: value,
          },
        });
      }),
      sorter: (a, b) => a.period_id.localeCompare(b.period_id),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return <Tag color="blue">{value}</Tag>;
      },
    },
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
      render: (value) => {
        return <span>{value}</span>;
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
        return value
          ? `Rp ${num.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "-";
      },
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
              title={`Confirm delete ${record?.code}?`}
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
