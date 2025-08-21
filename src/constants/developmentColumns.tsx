import type { Dispatch, SetStateAction } from "react";
import {
  statusWorks,
  type DevelopmentModel,
  type DevelopmentTableParams,
} from "../models/development";
import type { TFunction } from "i18next";
import type { ColumnsType } from "antd/es/table";
import { searchColumns } from "./searchColumns";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: DevelopmentTableParams;
  setTableParams: Dispatch<SetStateAction<DevelopmentTableParams>>;
  processing: boolean;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: DevelopmentModel) => void;
}

export const developmentColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  t,
  tableParams,
}: ColumnProps): ColumnsType<DevelopmentModel> => {
  return [
    {
      key: "name",
      title: t("development.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("name", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            name: value,
          },
        });
      }),
    },
    {
      key: "volume",
      title: t("development.volume"),
      dataIndex: "volume",
      sorter: (a, b) => a.volume.localeCompare(b.volume),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("volume", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            volume: value,
          },
        });
      }),
    },
    {
      key: "source_of_fund",
      title: t("development.source_of_fund"),
      dataIndex: "source_of_fund",
      sorter: (a, b) => a.source_of_fund.localeCompare(b.source_of_fund),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("source_of_fund", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            source_of_fund: value,
          },
        });
      }),
    },
    {
      key: "status",
      title: t("development.status"),
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("status", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            status: value,
          },
        });
      }),
      render: (value) => {
        const items = statusWorks.find((i) => i.value === value);

        return (
          <Tag
            color={
              value === "start"
                ? "blue"
                : value === "process"
                ? "yellow"
                : "green"
            }
          >
            {items?.label}
          </Tag>
        );
      },
    },
    {
      key: "start_at",
      title: t("development.start_at"),
      dataIndex: "start_at",
      sorter: (a, b) => a.start_at.localeCompare(b.start_at),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("start_at", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            start_at: value,
          },
        });
      }),
    },
    {
      key: "end_at",
      title: t("development.end_at"),
      dataIndex: "end_at",
      sorter: (a, b) => a.end_at.localeCompare(b.end_at),
      sortDirections: ["ascend", "descend"],
      ...searchColumns<DevelopmentModel>("end_at", (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            end_at: value,
          },
        });
      }),
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
