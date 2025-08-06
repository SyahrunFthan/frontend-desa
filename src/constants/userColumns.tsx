import type { ColumnsType } from "antd/es/table";
import type { UserModel, UserTableParams } from "../models/user";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { searchColumns } from "./searchColumns";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  handleDelete: (id: string) => void;
  handleEdit: (record: UserModel) => void;
  setTableParams: (params: UserTableParams) => void;
  processing: boolean;
  tableParams: UserTableParams;
}

const userColumns = ({
  handleDelete,
  handleEdit,
  processing,
  setTableParams,
  tableParams,
}: ColumnProps): ColumnsType<UserModel> => [
  {
    key: "username",
    title: "Username",
    dataIndex: "username",
    sorter: (a, b) => a.username.localeCompare(b.username),
    sortDirections: ["ascend", "descend"],
    width: "20%",
    ...searchColumns<UserModel>("username", (value) => {
      setTableParams({
        pagination: {
          ...tableParams.pagination,
        },
        filters: {
          ...tableParams.filters,
          username: value,
        },
      });
    }),
  },
  {
    key: "email",
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
    sortDirections: ["ascend", "descend"],
    ...searchColumns<UserModel>("email", (value) => {
      setTableParams({
        pagination: {
          ...tableParams.pagination,
        },
        filters: {
          ...tableParams.filters,
          email: value,
        },
      });
    }),
  },
  {
    key: "active",
    title: "Active",
    dataIndex: "token",
    render: (token) => {
      return token ? (
        <Tag color="green">Online</Tag>
      ) : (
        <Tag color="error">Offline</Tag>
      );
    },
  },
  {
    key: "role_id",
    title: "Role",
    dataIndex: "role_id",
    render: (_, record) => {
      return record?.role?.name;
    },
    width: "15%",
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
            title={`Confirm delete ${record?.username}?`}
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

export default userColumns;
