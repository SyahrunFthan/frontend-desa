import type { ColumnsType } from "antd/es/table";
import type { RoleModel, RoleTableParams } from "../models/role";
import { Link } from "react-router-dom";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export interface RoleColumnProps {
  tableParams: RoleTableParams;
  processing: boolean;
  handleDelete: (id: string) => void;
  handleEdit: (record: RoleModel) => void;
}

const roleColumns = ({
  tableParams,
  processing,
  handleDelete,
  handleEdit,
}: RoleColumnProps): ColumnsType<RoleModel> => [
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
    key: "name",
    title: "Name",
    dataIndex: "name",
    render: (value, record) => {
      return (
        <Link to={`/admin/roles/${record.id}`} className="text-blue-500">
          {value}
        </Link>
      );
    },
  },
  {
    key: "key",
    title: "Role Key",
    dataIndex: "key",
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

export default roleColumns;
