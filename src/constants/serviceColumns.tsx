import type { Dispatch, SetStateAction } from "react";
import {
  typeServices,
  type ServiceModel,
  type ServiceTableParams,
} from "../models/service";
import type { TFunction } from "i18next";
import type { ColumnsType } from "antd/es/table";
import { searchColumns, selectFilterColumn } from "./searchColumns";
import { status } from "../models/global";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ColumnProps {
  tableParams: ServiceTableParams;
  processing: boolean;
  setTableParams: Dispatch<SetStateAction<ServiceTableParams>>;
  t: TFunction;
  handleDelete: (id: string) => void;
  handleEdit: (record: ServiceModel) => void;
}

export const serviceColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  tableParams,
  t,
}: ColumnProps): ColumnsType<ServiceModel> => {
  return [
    {
      key: "no",
      title: "No.",
      render: (_, __, index) => {
        const page = tableParams.pagination?.current || 1;
        const pageSize = tableParams.pagination?.pageSize || 5;

        return (page - 1) * pageSize + index + 1;
      },
      width: "7%",
    },
    {
      key: "name",
      title: t("service.name"),
      dataIndex: "name",
      ...searchColumns<ServiceModel>("name", (value) => {
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
      render: (value, record) => {
        return (
          <Link
            to={record.template_path}
            target="_blank"
            className="text-blue-500"
          >
            {value}
          </Link>
        );
      },
    },
    {
      key: "type_service",
      title: t("service.type_service"),
      dataIndex: "type_service",
      ...selectFilterColumn<ServiceModel>("category", typeServices, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            type_service: value,
          },
        });
      }),
      sorter: (a, b) => a.type_service.localeCompare(b.type_service),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = typeServices.find(
          (item) => item.value === value && item.label
        );

        return item?.label;
      },
    },
    {
      key: "status_service",
      title: t("service.status_service"),
      dataIndex: "status_service",
      ...selectFilterColumn<ServiceModel>("status", status, (value) => {
        setTableParams({
          ...tableParams,
          filters: {
            ...tableParams.filters,
            status_service: value,
          },
        });
      }),
      sorter: (a, b) => a.status_service.localeCompare(b.status_service),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const item = status.find((item) => item.value === value);

        return (
          <Tag color={value === "active" ? "green" : "red"}>{item?.label}</Tag>
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
