import type { TFunction } from "i18next";
import type {
  RTUnitExtends,
  RTUnitModel,
  RTUnitTableParams,
} from "../models/rtUnit";
import type { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ColumnProps {
  tableParams: RTUnitTableParams;
  handleDelete: (id: string) => void;
  handleEdit: (record: RTUnitModel) => void;
  processing: boolean;
  t: TFunction;
}

export const rtUnitColumns = ({
  handleDelete,
  handleEdit,
  processing,
  tableParams,
  t,
}: ColumnProps): ColumnsType<RTUnitExtends> => {
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
      key: "code",
      title: t("rt.code"),
      dataIndex: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "rw_id",
      title: t("rt.rw_id"),
      dataIndex: ["rw_unit", "code"],
      sorter: (a, b) => a.rw_unit.code.localeCompare(b.rw_unit.code),
      sortDirections: ["ascend", "descend"],
    },
    {
      key: "name_of_chairman",
      title: t("rt.name_of_chairman"),
      dataIndex: "name_of_chairman",
      sorter: (a, b) => a.name_of_chairman.localeCompare(b.name_of_chairman),
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
