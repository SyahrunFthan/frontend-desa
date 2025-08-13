import type { ColumnsType } from "antd/es/table";
import {
  typeAssistances,
  type AssistanceCategoryModel,
  type AssistanceCategoryTableParams,
} from "../models/assistanceCategory";
import type { TFunction } from "i18next";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { status } from "../models/global";

interface ColumnProps {
  tableParams: AssistanceCategoryTableParams;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: AssistanceCategoryModel) => void;
  processing: boolean;
}

export const assistanceCategoryColumns = ({
  handleDelete,
  handleEdit,
  processing,
  tableParams,
  t,
}: ColumnProps): ColumnsType<AssistanceCategoryModel> => {
  return [
    {
      key: "no",
      title: "No.",
      width: "7%",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current || 1;
        const pageSize = tableParams.pagination?.pageSize || 5;

        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      key: "name",
      title: t("social_assistance.category.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (value, record) => {
        return record.amount
          ? `${value} / Rp ${record.amount.toLocaleString()}`
          : value;
      },
    },
    {
      key: "type_assistance",
      title: t("social_assistance.category.type_assistance"),
      dataIndex: "type_assistance",
      sorter: (a, b) => a.type_assistance.localeCompare(b.type_assistance),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = typeAssistances.find((item) => item.value === value);

        return (
          <Tag color={value === "cash" ? "green" : "blue"}>{item?.label}</Tag>
        );
      },
    },
    {
      key: "status",
      title: t("social_assistance.category.status"),
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = status.find((item) => item.value === value);
        return (
          <Tag color={value === "active" ? "green" : "red"}>{item?.label}</Tag>
        );
      },
    },
    {
      key: "year",
      title: t("social_assistance.category.year"),
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return value ? value : "-";
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
              title={`Confirm delete ${record?.name}?`}
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
