import type { TFunction } from "i18next";
import type { ActivityModel, ActivityTableParams } from "../models/activity";
import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface ColumnProps {
  tableParams: ActivityTableParams;
  t: TFunction;
  processing: boolean;
  handleDelete: (id: string) => void;
  handleEdit: (record: ActivityModel) => void;
}

export const activityColumns = ({
  handleDelete,
  handleEdit,
  t,
  processing,
  tableParams,
}: ColumnProps): ColumnsType<ActivityModel> => {
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
      title: t("activity.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "date_of_activity",
      title: t("activity.date_of_activity"),
      dataIndex: "date_of_activity",
      sorter: (a, b) => a.date_of_activity.localeCompare(b.date_of_activity),
      sortDirections: ["ascend", "descend"],
      render: (value) => {
        return dayjs(value, "YYYY-MM-DD").format("dddd, DD MMMM YYYY");
      },
    },
    {
      key: "location",
      title: t("activity.location"),
      dataIndex: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ["ascend", "descend"],
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
