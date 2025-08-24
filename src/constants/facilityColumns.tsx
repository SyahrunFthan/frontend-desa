import type { TFunction } from "i18next";
import {
  type_facilities,
  type FacilityModel,
  type FacilityTableParams,
} from "../models/facility";
import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { status } from "../models/global";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: FacilityTableParams;
  handleDelete: (id: string) => void;
  handleEdit: (record: FacilityModel) => void;
  processing: boolean;
  t: TFunction;
}

export const facilityColumns = ({
  handleDelete,
  handleEdit,
  processing,
  tableParams,
  t,
}: ColumnProps): ColumnsType<FacilityModel> => {
  return [
    {
      key: "no",
      title: "No.",
      width: "7%",
      render(_, __, index) {
        const page = tableParams.pagination?.current ?? 1;
        const pageSize = tableParams.pagination?.pageSize ?? 5;

        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      key: "name",
      title: t("facility.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "type_facility",
      title: t("facility.type_facility"),
      dataIndex: "type_facility",
      sorter: (a, b) => a.type_facility.localeCompare(b.type_facility),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const items = type_facilities.find((i) => i.value === value);

        return <Tag color="blue">{items?.label}</Tag>;
      },
    },
    {
      key: "latitude",
      title: t("facility.latitude"),
      dataIndex: "latitude",
      sorter: (a, b) => a.latitude - b.latitude,
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "longitude",
      title: t("facility.longitude"),
      dataIndex: "longitude",
      sorter: (a, b) => a.longitude - b.longitude,
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "status",
      title: t("facility.status"),
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        const items = status.find((i) => i.value === value);

        return (
          <Tag color={value === "active" ? "green" : "red"}>{items?.label}</Tag>
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
