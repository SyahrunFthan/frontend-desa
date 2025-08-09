import type { TFunction } from "i18next";
import type { IncomeModel, IncomeTableParams } from "../models/income";
import type { ColumnsType } from "antd/es/table";
import { searchColumns, selectFilterColumn } from "./searchColumns";
import type { Option } from "../models/global";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: IncomeTableParams;
  setTableParams: (params: IncomeTableParams) => void;
  handleDelete: (id: string) => void;
  handleEdit: (record: IncomeModel) => void;
  periods: Option[];
  processing: boolean;
  t: TFunction;
}

export const incomeColumns = ({
  handleDelete,
  handleEdit,
  processing,
  periods,
  setTableParams,
  t,
  tableParams,
}: ColumnProps): ColumnsType<IncomeModel> => [
  {
    key: "period_id",
    title: t("incomes.period_id"),
    dataIndex: ["period", "year"],
    ...selectFilterColumn<IncomeModel>("ID Period", periods, (value) => {
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
  },
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
  },
  {
    key: "amount",
    title: t("incomes.amount"),
    dataIndex: "amount",
    sorter: (a, b) => a.amount - b.amount,
    sortDirections: ["ascend", "descend"],
    render: (value) => {
      return `Rp ${value.toLocaleString()}`;
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
